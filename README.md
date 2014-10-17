dynamic-timer [![NPM version](https://badge.fury.io/js/dynamic-timer.svg)](http://badge.fury.io/js/dynamic-timer) [![Build Status](https://travis-ci.org/Tjatse/dynamic-timer.svg?branch=master)](https://travis-ci.org/Tjatse/node-readability)
=============

Schedule execution of a one-time callback after delay milliseconds, automatic, intelligence and without bothering, the delay is calculated from different algorithms, e.g.: Lucas Sequence, Fibonacci Sequence, DaYan Series and Arithmetic Procession.

**So, the next `delay` will be generated by the specific strategy, but not a fixed one. This will take a high performance on long-polling, handshake, ping-pong, reconnect, task worker or something else.**

## Installation
```
npm install dynamic-timer
```

## Guide
- [Usage](#Usage)
- [Events](#Events)
- [Methods](#Methods)
- [Properties](#Properties)
- [Example](#Example)
- [Test](#Test)

## Usage
``` javascript
var dynamicTimer = require('dynamic-timer');
var dynamicTimeout = dynamicTimer([options]);
```

`options` are including:
- **seed** The cardinal number of delay, 1000(milliseconds) as default.
- **delay** The first callback will be called in exactly milliseconds, 1000(milliseconds) as default.
- **strategy** Calculate delay milliseconds by strategy, see more information from [Strategy](#Strategy).
- **maxAttempts** The maximize attempts, the Timer locks `maxAttempts` for different strategy, even when you set the `maxAttempts`, it can not greater than bellows:
  - *procession*  5000
  - *dayan*       141
  - *fibonacci*   20
  - *lucas*       19
- **maxDelay** The maximize delay.
- **overrun** When the attempts greater than `maxAttempts` or next `delay` greater than `maxDelay` means Timer is overrunning, this property should be:
  - **stop** Stop the timer immediately, equals `dynamicTimeout.state.STOP`
  - **reset** Reset the Timer to initial state and start again, equals `dynamicTimeout.state.RESET`
  - **overload** Keep running, but all the next `delay`s will be set to `maxDelay`, equals `dynamicTimeout.state.OVERLOAD`
- **autostart** Automatic start Timer, default as `false`, if the property was set to `true`, there is no necessary to do `dynamicTimeout.start`

## Strategy
Timer supports four strategies:
- **arithmetic procession**
  Arithmetic Procession, equals `dynamicTimeout.strategy.PROCESSION`, the sequence increases like:
  ```
  1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21...
  ```
  It is increasing placid, so when you set the `seed` as 1000, the Timer will trigger after `1s, 3s, 5s, 7s, 11s...` not insipid `1s, 1s, 1s...`.

- **dayan**
  DaYan Series, equals `dynamicTimeout.strategy.DAYAN`, the sequence increases like:
  ```
  0, 2, 4, 8, 12, 18, 24, 32, 40, 50...
  ```
  It is increasing placid too, but speedier then *Arithmetic Procession*, I like this algorithm most, so using it as default value for `strategy`.

- **fibonacci**
  Fibonacci Sequence, equals `dynamicTimeout.strategy.FIBONACCI`, the sequence increase like:
  ```
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377...
  ```
  It is increasing speedy, we can use this strategy to deal with some non-concurrent job.

- **lucas**
  Lucas Sequence, equals `dynamicTimeout.strategy.LUCAS`, the sequence increase like:
  ```
  1, 3, 4, 7, 11, 18, 29, 47, 76, 123, 199, 322, 521...
  ```
  *Lucas* is similar to *Fibonacci* but increases speedier.

**Notes:** If you are interesting in these algorithms, you can take a test with the *example/algorithm.js*.

## Events
### tick
This event is triggered after `delay` milliseconds, do your job in the callback:
```javascript
dynamicTimeout.on('tick', function(){
  console.log('#' + dynamicTimeout.attempts, 'next after', dynamicTimeout.delay);
})
```
### toll
This event is triggered after state has been changed.
```javascript
dynamicTimeout.on('toll', function(state){
  console.log('current state:', state);
})
```

## Methods
### start
Start the Timer, when `autostart` set to `true`, this event triggered nothing.
```javascript
dynamicTimeout.start();
```

### stop
Stop the Timer, when current state of Timer was `STOP`, this event triggered nothing.
```javascript
dynamicTimeout.stop();
```

### pause
Stop the Timer, when current state of Timer was not `RUNNING`, this event triggered nothing.
```javascript
dynamicTimeout.pause();
```

### resume
Resume the Timer, when current state of Timer was not `PAUSE`, this event triggered nothing.
```javascript
dynamicTimeout.resume();
```

### reset
Reset the Timer to initial status.
```javascript
// stop timer.
dynamicTimeout.reset(true);
```
The argument indicates whether stop the timer or not, if it was not passed or set to `false`, just reset Timer and tick again from initial status.

## Properties
### attempts
The attempts Timer has run.

### delay
The next delay(milliseconds).

### state
Current state of Timer, including:
- `dynamicTimeout.state.PAUSE`, equals `pause`,
- `dynamicTimeout.state.RESUME`, equals `resume`,
- `dynamicTimeout.state.RESET`, equals `reset`,
- `dynamicTimeout.state.RUNNING`, equals `running`,
- `dynamicTimeout.state.STOP`, equals `stop`

## Example
```javascript
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
```
> See more examples under `example` and `test` folders.

## Test
```
npm test
```

## TODO
[ ] Test cases.
[ ] Typo bug fixing.

## License
Copyright 2014 Tjatse

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
