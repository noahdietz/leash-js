# leash-js
This is a node-based mongodb service controller built on forever.js

### Inspiration
I was building a backend to test my senior project and got tired of running mongodb from my terminal whenever I wanted to test my API. So I built this with the intention of it making it easier to start the mongodb service whenever my local server started.

This project is meant for simple, local databases possibly for testing a website or API. It isn't developed with industry-use in mind, more for hackthons.

### Installation & Setup
Install it directly into your node project.
```
npm i --save leash
```

Make sure that you have mongodb installed on your computer (might need sudo access for this).
```
npm i -g mongodb
```
Finally, create a directory that mongodb can use.
```
mdkir ~/mydb/
```

### How to use
```js
var leash = require('leash');

// available mongodb options currently
var options = {
  logs: '~/mylog.log',
  port: 6000
}

leash.start('~/mydb', options , function(err) {
  if (err) {
    return console.error(err);
  }
  
  console.log('successful start!');
});

/* do stuff */

leash.stop(function(err) {
  if (err) {
    return console.error(err); 
  }
  
  console.log('all stopped!');
});
```
