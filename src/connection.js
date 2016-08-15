import amqplib from 'amqplib';
let connection = null;

export default async function connect(config) {
  if (connection) return connection;

  const t = setTimeout(() => {throw new Error('AMQP: Connection timeout is off')}, config.timeout || 1500);
  const conn = await amqplib.connect(config.path);
  clearTimeout(t);
  connection = conn;
  return conn;

  process.once('SIGINT', () => connection.close());
  return connection;
}
