var dynamicTimer = require('../'),
  util = require('util');

var dynamicTimeout = dynamicTimer({
  seed:1000,
  delay:1000,
  strategy:dynamicTimer.strategy.PROCESSION,
  maxAttempts:10,
  maxDelay:4000,
  overrun:dynamicTimer.state.STOP, // stop, reset, overload
  autostart:false
});
dynamicTimeout.on('tick', function (o) {
  util.log('#' + dynamicTimeout.attempts + ', next after ' + dynamicTimeout.delay + ' ms');
});
dynamicTimeout.on('toll', function (state) {
  util.log(state);
});
util.log('start timer');
dynamicTimeout.start();


// test pause, resume and stop.
setTimeout(function () {
  dynamicTimeout.pause();
}, 3000);

setTimeout(function () {
  dynamicTimeout.resume();
}, 10000);
setTimeout(function () {
  dynamicTimeout.resume();
}, 6000);

setTimeout(function () {
  dynamicTimeout.stop();
}, 31000);
setTimeout(function () {
  dynamicTimeout.stop();
}, 32000);
