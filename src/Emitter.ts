import {Channel} from "amqplib"

class Emitter {
  private channel: Channel
  private exchange: any
  ready: boolean
  
  constructor() {
    this.ready = false
    this.channel = null
    this.exchange = null
  }
  async init(config, connection) {
    /* Prevent to create new connections */
    if (this.ready) return this

    /* Assert exchange */
    this.channel = await connection.createChannel()
    await this.channel.assertExchange(config.exchange, 'topic')
    this.exchange = config.exchange
    this.ready = true
  }

  publish(path, message) {
    if (!this.ready) {
      console.warn('Emitter not initialized. You should init emitter first.')
      return
    }

    /* send message */
    const _message = typeof message === 'string' ? message : JSON.stringify(message)
    this.channel.publish(this.exchange, path, new Buffer(_message))
  }
}

export {
  Emitter
}
