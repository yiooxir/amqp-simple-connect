import * as amqplib from 'amqplib'
import { Connection } from "amqplib"
let connection: Connection = null

async function connect(config) {
  if (connection) return connection

  const t = setTimeout(() => {throw new Error('AMQP: Connection timeout is off')}, config.timeout || 1500)
  connection = await amqplib.connect(config.path)
  clearTimeout(t)

  process.once('SIGINT', () => connection.close())
  return connection
}

export {
  connect
}
