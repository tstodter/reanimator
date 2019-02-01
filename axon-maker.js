const { fork } = require('child_process');
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const fsReaddir = util.promisify(fs.readdir);
const fsStat = util.promisify(fs.stat);
const amqp = require('amqplib');

const makeFiber = R.pipe(
  x => ([x]),
  R.flatten,
  R.map(JSON.stringify),
  stringifiedArgs => fork('axon.js', stringifiedArgs)
);

(async () => {
  const directoryContents = await fsReaddir('./neurons');

  const fibers = await directoryContents.reduce(async (fibers, fileName, i) => {
    fibers = await fibers;

    const stats = await fsStat(`./neurons/${fileName}`);

    if (stats && stats.isDirectory()) {
      return fibers;
    }

    return [
      ...fibers,
      makeFiber({
        id: i,
        neuronFile: fileName
      })
    ];
  }, Promise.resolve([]));

  const readline = require('readline');
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const openConnection = await amqp.connect('amqp://user:pass@localhost');
  const channel = await openConnection.createChannel();

  readlineInterface.on('line', async (line) => {
    await channel.assertExchange('topic_exchange', 'topic', {durable: false});
    channel.publish('topic_exchange', 'reanimator.start', Buffer.from(line))
  });
})();
