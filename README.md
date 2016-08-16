# amqp-simple-connect
Simple wrapper for amqp. Provide only two simple methods: #publish & #subscribe.

## Installation

```
npm install --save amqp-simple-connect
```

## Example

``` javascript
import amqp from 'amqp-simpe-connect'

const config = {
  // url for amqp entrance
  path: 'amqp://dev.rabbitmq.com',
  // exchange name
  exchange: 'test.topic',
}



async function () {
  const testQueueName = 'test_queue';
  
  // Connect amqp. It is a singletone. In real code you can initialize connection in you main app file.
  await amqp.connect(config);
  
  // Create queue. You can create as many queues as you want;
  const queue = amqp.createQueue(testQueueName);
  
  // Subscribe to queue.
  queue.subscribe((message, ack) => {
    console.log(message); // => {a: 1}
    
    // acknowledge message;
    ack();
  })
  
  // Publish to queue.
  amqp.publish(testQueueName, {a: 1})
  
  // Close queue connection.
  await queue.close();
}
```


