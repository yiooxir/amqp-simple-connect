import { stringHash } from './helpers';

export default class QueueFabric {
  constructor(queueName) {
    this.config = null;
    this._channel = null;
    this.queueName = queueName;
    this.ready = false;
    this.consumerTag = stringHash();
  }

  static get defInitOptions () {
    return {
      purge: false
    }
  }

  async connect (connection, config, options=QueueFabric.defInitOptions) {
    if (this.ready) return Promise.resolve();

    this._channel = await connection.createChannel();
    await this._channel.assertExchange(config.exchange, 'topic');
    await this._channel.assertQueue(this.queueName);
    await this._channel.bindQueue(this.queueName, config.exchange, this.queueName);

    if (options.purge) {
      await this._channel.purgeQueue(this.queueName);
    }

    this.ready = true;
    this.config = config;

    return this;
  }

  subscribe(callback) {
    if (!this.ready) {
      logger.warn(`Queue ${this.queueName} not initialized. You should connect it first: q#getQueue(name)#connect(config)`);
    }

    this._channel.consume(
      this.queueName,
      (message) => callback(
        JSON.parse(message.content.toString()),
        () => this._channel.ack(message),
        message.fields
      ),
      {consumerTag: this.consumerTag}
    );
  }

  async close() {
    const that = this;

    await this._channel.cancel(that.consumerTag);
    await this._channel.close();
    this.ready = false;
  }
}
