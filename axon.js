const amqp = require('amqplib');
const R = require('ramda');
const {
  resolveNeuron
} = require('./neurons/composables');

const {
  id,
  neuronFile
} = JSON.parse(process.argv[2]);

const neuron = require(`./neurons/${neuronFile}`);

const exchange = 'topic_exchange';

let _channel;
const getChannel = async () => {
  if (!_channel) {
    const openConnection = await amqp.connect('amqp://user:pass@localhost', {
      auth: 'user:pass'
    });
    _channel = await openConnection.createChannel();
  }

  return _channel;
};

const initializeSubscription = async (handler) => {
  const channel = await getChannel();

  await channel.assertExchange(exchange, 'topic', {durable: false});

  const queue = await channel.assertQueue('', {exclusive: true});

  await Promise.all(
    neuron.subs.map(subKey =>
      channel.bindQueue(queue.queue, exchange, subKey)));

  return channel.consume(queue.queue, msg => {
    handler(msg);
  }, {noAck: true});
};

const publish = async (pubTopics, msg) => {
  const channel = await getChannel();

  await channel.assertExchange(exchange, 'topic', {durable: false});

  pubTopics.forEach(pubKey => {
    // console.log('publishing', pubKey, msg);
    channel.publish(exchange, pubKey, Buffer.from(msg));
  });
};

const extractContent = R.compose(
  R.invoker(0, 'toString'),
  R.prop('content')
);

console.log(`Nerve fiber ${id} for ${neuronFile} starting`);

(async () => {
  const channel = await getChannel();

  channel.assertExchange(exchange, 'topic', {durable: false});

  await initializeSubscription(async msg => {
    let content;
    try {
      content = extractContent(msg);
    } catch (err) {
      console.error('Error extracting msg content', err.message);
    }
    const realNeuron = resolveNeuron(neuron, content);
console.log(realNeuron);
    try {
      const result = await neuron.f(content);

      if (result) {
        // console.log('))succe', 'publishing', result);
        await publish(realNeuron.pubs, result);
      }
    } catch (err) {
      console.error('Error publishing to', realNeuron.pubs_error, err);
      await publish(realNeuron.pubs_error,
        `ERROR in [${realNeuron.subs}] -> [${realNeuron.pubs}] ::: ${err.message}`
      );
    }
  })
})();

exports.publish = publish;
