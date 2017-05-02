import { stringHash } from './helpers'
import { Channel } from "amqplib"

class Queue {
  private channel: Channel
  config: any
  queueName: string
  ready: boolean
  consumerTag: any
  
  constructor(queueName) {
    this.config = null
    this.channel = null
    this.queueName = queueName
    this.ready = false
    this.consumerTag = stringHash()
  }

  static get defInitOptions () {
    return {
      purge: false
    }
  }

  public async connect (connection, config, options=Queue.defInitOptions): Promise<Queue> {
    if (this.ready) return this

    this.channel = await connection.createChannel()
    await this.channel.assertExchange(config.exchange, 'topic')
    await this.channel.assertQueue(this.queueName)
    await this.channel.bindQueue(this.queueName, config.exchange, this.queueName)

    if (options.purge) {
      await this.channel.purgeQueue(this.queueName)
    }

    this.ready = true
    this.config = config

    return this
  }

  public subscribe(callback): void {
    if (!this.ready) {
      console.warn(`Queue ${ this.queueName } not initialized. You should connect it first: q#getQueue(name)#connect(config)`)
    }

    this.channel.consume(
      this.queueName,
      (message) => callback(
        JSON.parse(message.content.toString()),
        () => this.channel.ack(message),
        message.fields
      ),
      {consumerTag: this.consumerTag}
    )
  }

  public async close() {
    const that = this
    await this.channel.cancel(that.consumerTag)
    await this.channel.close()
    this.ready = false
  }
}

export {
  Queue
}