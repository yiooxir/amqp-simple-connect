// import 'mocha'
// import amqp from '../index'
const amqp = require('../index')

const config = {
  path: 'amqp://wrmxpydd:HdlmdXwG9kKz7hp3abQXjlYG8JoTzXk7@spotted-monkey.rmq.cloudamqp.com/wrmxpydd',
  exchange: 'fx-test.topic',
  purge: true
}

describe('test', () => {
  let testQueue

  before('init test', done => {
    amqp.configure({purge: true})

    amqp.connect(config)
      .then(() => amqp.createQueue('test_queue'))
      .then(q => {
        testQueue = q
        done()
      })
      .catch(err => console.error(err))
  })

  it('should return OK', (done) => {

    // testQueue.subscribe((message, ack) => {
    //   console.log(message)
    //   ack()
    //   done()
    // })

    testQueue.subscribe(data => {
      console.log(11, data)
    })

    amqp.publish('test_queue', {a: 1})

    setTimeout(done, 500)
  })
})
