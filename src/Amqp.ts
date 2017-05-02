import { Emitter } from './Emitter'
import { Queue } from './Queue'
import { connect } from './connection'
import { Connection } from "amqplib"


class AMQP {
  private emitter: Emitter
  private connection: Connection
  config: any
  options: any
  connected: boolean

  constructor(options = {}) {
    this.config = null
    this.options = {...AMQP.defOptions, ...options}
    this.emitter = null
    this.connection = null
    this.connected = false
  }

  static defOptions = {
    purge: false,
    timeout: 1900,
    reportLevel: 'error'
  }

  public configure(options) {
    return this.options = Object.assign({}, this.options, options)
  }

  public async connect(config: any = {}) {

    if (this.connected) return this

    if (!config.path) {
      throw new Error('Parameter @path required for connecting to queue')
    }

    this.connection = await connect(config)
    this.emitter = new Emitter()
    await this.emitter.init(config, this.connection)
    this.connected = true
    this.config = config
    return this
  }

  public publish(path, message) {
    if (!this.connected) {
      console.warn('Try to publish to disconnected exchanger')
    }

    this.emitter.publish(path, message)
  }

  public async createQueue(qName, options): Promise<Queue> {
    if (!this.connected) {
      console.warn('Try to create queue in disconnected exchanger')
    }

    const q = new Queue(qName)
    return await q.connect(this.connection, this.config, {...this.options, ...options})
  }
}

const amqp = new AMQP()

export {
  amqp
}
