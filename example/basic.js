
var dynamicTimer = require('../'),
  util = require('util');

var dynamicTimeout = dynamicTimer();
dynamicTimeout.on('tick', function () {
  util.log('#' + dynamicTimeout.attempts + ', next after ' + dynamicTimeout.delay + ' ms');
});
dynamicTimeout.on('toll', function(state){
  util.log(state);
});
util.log('start timer');
dynamicTimeout.start();