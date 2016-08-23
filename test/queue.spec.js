import 'mocha';
import amqp from '../src';

const config = {
  path: 'amqp://wrmxpydd:HdlmdXwG9kKz7hp3abQXjlYG8JoTzXk7@spotted-monkey.rmq.cloudamqp.com/wrmxpydd',
  exchange: 'fx-test.topic',
  purge: true
}

describe('test', () => {
  let testQueue;

  before('init test', async() => {
    try {
      amqp.configure({purge: true});
      await amqp.connect(config);
      testQueue = await amqp.createQueue('test_queue');
    } catch(err) {
      console.error(err);
    }

  })

  it('should return OK', (done) => {

    // testQueue.subscribe((message, ack) => {
    //   console.log(message);
    //   ack();
    //   done();
    // })


    amqp.publish('test_queue', {a: 1});

    setTimeout(done, 500)
  })
})
