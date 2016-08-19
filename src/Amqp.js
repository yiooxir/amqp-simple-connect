import Emitter from './Emitter';
import Queue from './Queue';
import connect from './connection';


class AMQP {
  constructor(options) {
    this.config = null;
    this.options = {...AMQP.defOptions, ...options}
    this._emitter = null;
    this._Subscriber = null;
    this._connection = null;
    this.connected = false;
  }

  static defOptions = {
    purge: false,
    timeout: 1900,
    reportLevel: 'error'
  }

  async connect(config) {

    if (this.connected) return this;

    if (!config && !config.path) {
      throw new Error('Parameter @path required for connecting to queue');
    }

    this._connection = await connect(config, this.options);
    this._emitter = new Emitter();
    await this._emitter.init(config, this._connection);
    this.connected = true;
    this.config = config;
    return this;
  }

  publish(path, message) {
    if (!this.connected) {
      console.warn('Try to publish to disconnected exchanger');
    }

    this._emitter.publish(path, message);
  }

  async createQueue(qName, options) {
    const q = new Queue(qName, this.config);
    return await q.connect(this._connection, this.config, {...this.options, options});
  }
}

export default new AMQP();