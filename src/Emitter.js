'use strict';

class Emitter {
  constructor() {
    this.ready = false;
    this._channel = null;
    this._exchange = null;
  }
  async init(config, connection) {
    /* Prevent to create new connections */
    if (this.ready) return this;

    /* Assert exchange */
    this._channel = await connection.createChannel();
    await this._channel.assertExchange(config.exchange, 'topic');
    this._exchange = config.exchange;
    this.ready = true;
  }

  publish(path, message) {
    if (!this.ready) {
      console.warn('Emitter not initialized. You should init emitter first.');
      return;
    }

    /* send message */
    const _message = typeof message === 'string' ? message : JSON.stringify(message);
    this._channel.publish(this._exchange, path, new Buffer(_message));
  }
}

export default Emitter;
