var util = require('util'),
  EventEmitter = require('events').EventEmitter;

module.exports = Timer;

/**
 * A dynamic, intelligence timer,
 * @param {Object} options read more information from README.md
 * @return {Timer}
 * @constructor
 */
function Timer(options){
  if(!(this instanceof  Timer)){
    return new Timer(options);
  }
  this.__genOptions(options);
  this.options.autostart && this.start();
}
util.inherits(Timer, EventEmitter);

/**
 * Start the timer
 * @notes if `autostart` property was set to `true`, this method do nothing.
 */
Timer.prototype.start = function(){
  if(this.state != Timer.state.RUNNING){
    this.reset(false);
  }
};

/**
 * Stop the timer.
 */
Timer.prototype.stop = function(){
  // if timer was stopped, do nothing.
  if(this.state == Timer.state.STOP){
    return;
  }
  // stop timer immediately.
  this.__reset(true, true);
  this.state = Timer.state.STOP;
  this.emit('toll', this.state);
};

/**
 * Reset timer.
 * @param {Boolean} stop A value indicates whether stop the timer, if it was set to `false`,
 *                        just reset timer and tick again from initial status.
 */
Timer.prototype.reset = function(stop){
  this.__reset(stop, true);
};

/**
 * Pause timer from RUNNING state.
 */
Timer.prototype.pause = function(){
  // if previous state was not RUNNING, do nothing.
  if(this.state != Timer.state.RUNNING){
    return;
  }

  // reset timer but remember the last attempts.
  var pausedAttempts = this.attempts;
  this.__reset(true, true);
  this.attempts = pausedAttempts;

  // change state to PAUSE and emit `toll` event.
  this.state = Timer.state.PAUSE;
  this.emit('toll', this.state);
};
/**
 * Resume timer from PAUSE state.
 */
Timer.prototype.resume = function(){
  // if previous state was not PAUSE, do nothing.
  if(this.state != Timer.state.PAUSE){
    return;
  }
  // change state to RESUME and emit `toll` event.
  this.state = Timer.state.RESUME;
  this.emit('toll', this.state);

  // change state to RUNNING, calculate next delay and start timer again.
  this.state = Timer.state.RUNNING;
  this.delay = this.__nextDelay(this.attempts + 1);
  this.__nextTick();
};

/**
 * Generate options.
 * @param {Object} options original options passed in.
 * @private
 */
Timer.prototype.__genOptions = function(options){
  // make sure it's an object.
  if(typeof options != 'object'){
    options = {};
  }

  // mixin default.
  options = this.__mixin({
    delay: 1000,
    seed: 1000,
    strategy: Timer.strategy.DAYAN,
    maxAttempts: 0,
    maxDelay: 0,
    overrun: Timer.state.OVERLOAD,
    autostart: false
  }, options);

  // bind seed and first delay.
  isNaN(options.seed) && (options.seed = 1000);
  isNaN(options.delay) && (options.delay = 1000);

  // strategy must be one value of `Timer.strategy`.
  options.strategy = options.strategy.toLowerCase();
  if(!~Object.keys(Timer.strategy).indexOf(options.strategy.toUpperCase())){
    options.strategy = Timer.strategy.DAYAN;
  }

  // overrun must be one value of [Timer.state.STOP, Timer.state.RESET, Timer.state.OVERLOAD].
  options.overrun = options.overrun.toLowerCase();
  if(!~[Timer.state.STOP, Timer.state.RESET, Timer.state.OVERLOAD].indexOf(options.overrun)){
    options.overrun = Timer.strategy.OVERLOAD;
  }

  // each algorithm has it's default `maxAttempts` to make sure the
  // delay not over 10000( * seed). 'Cause when this is happening, the delay
  // is too large to do setTimeout job.
  var apts = {};
  apts[Timer.strategy.PROCESSION] = 5000;
  apts[Timer.strategy.DAYAN] = 141;
  apts[Timer.strategy.FIBONACCI] = 20;
  apts[Timer.strategy.LUCAS] = 19;

  var apt = apts[options.strategy];
  if(isNaN(options.maxAttempts) || !options.maxAttempts || options.maxAttempts > apt){
    options.maxAttempts = apt;
  }

  // if `maxDelay` is not a Number or 0, set it to maximize.
  if(isNaN(options.maxDelay) || !options.maxDelay){
    options.maxDelay = Infinity;
  }

  this.options = options;
};

/**
 * Go to next tick.
 * @private
 */
Timer.prototype.__nextTick = function(){
  this.timer = setTimeout(function(ctx){
    // increase attempts.
    ctx.attempts += 1;
    // calculating the next delay and preparing for next tick.
    ctx.delay = ctx.__nextDelay(ctx.attempts + 1);

    // check overrun status.
    if(!ctx.overed){
      ctx.overed = (ctx.attempts >= ctx.options.maxAttempts || ctx.delay >= ctx.options.maxDelay);
    }
    if(ctx.overed){
      // whether overrun.
      switch(ctx.options.overrun){
        case Timer.state.STOP:
          // stop timer.
          ctx.emit('tick');
          return ctx.stop();
        case Timer.state.RESET:
          // reset timer.
          ctx.emit('tick');
          return ctx.reset(false);
        case Timer.state.OVERLOAD:
          break;
      }
    }

    // go to next tick.
    ctx.__nextTick();
    // emit tick event
    ctx.emit('tick');
  }, this.delay, this);
};

/**
 * Calculate next delay for setTimeout.
 * @param {Number} n the next attempts.
 * @return {Number} timeout(milliseconds).
 * @private
 */
Timer.prototype.__nextDelay = function(n){
  // attempts should not greater than `maxAttempts`.
  n = Math.min(n, this.options.maxAttempts);
  // calculate finally series by strategy.
  switch (this.options.strategy){
    case Timer.strategy.PROCESSION:
      n = 2 * n -1;
      break;
    case Timer.strategy.DAYAN:
      n = (n * n - n % 2)/2;
      break;
    case Timer.strategy.FIBONACCI:
      var gh5 = Math.sqrt(5);
      n = Math.round((Math.pow((1 + gh5), n) - Math.pow((1 - gh5), n)) / (Math.pow(2, n) * gh5));
      break;
    case Timer.strategy.LUCAS:
      var gh5 = Math.sqrt(5);
      n = Math.round(Math.pow((1 + gh5)/2, n) + Math.pow((1 - gh5)/2, n));
      break;
  }

  // return timeout(milliseconds).
  return Math.min(n * this.options.seed, this.options.maxDelay);
};

/**
 * Mix in two objects
 * @param {Object} target
 * @param {Object} source
 * @return {*}
 * @private
 */
Timer.prototype.__mixin = function(target, source){
  for (var p in source) {
    if (source.hasOwnProperty(p)) {
      target[p] = source[p];
    }
  }
  return target;
};

/**
 * Reset timer.
 * @param {Boolean} stop A value indicates whether stop the timer or not.
 * @param noNotify A value indicates whether emit the `toll` event or not, true means not.
 * @private
 */
Timer.prototype.__reset = function(stop, noNotify){
  this.timer && (clearTimeout(this.timer));
  this.timer = null;
  this.delay = this.options.delay;
  this.attempts = 0;
  delete this.overed;
  if(!stop){
    this.state = Timer.state.RESET;
    !noNotify && this.emit('toll', this.state);
    this.state = Timer.state.RUNNING;
    this.__nextTick();
  }
};

/**
 * Strategies.
 * @type {Object}
 */
Timer.strategy = {
  'FIBONACCI': 'fibonacci',
  'PROCESSION': 'procession',
  'LUCAS': 'lucas',
  'DAYAN': 'da yan'
};
/**
 * States of Timer.
 * @type {Object}
 */
Timer.state = {
  'PAUSE': 'pause',
  'RESUME': 'resume',
  'RESET': 'reset',
  'RUNNING': 'running',
  'STOP': 'stop',
  'OVERLOAD': 'overload'
};