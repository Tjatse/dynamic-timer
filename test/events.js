var chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  dynamicTimer = require('../');

describe('Timer', function(){
  describe('should run normal', function(){
    it('until `stop` is called', function(done){
      var dynamicTimeout = dynamicTimer();
      dynamicTimeout.on('tick', function(){
        dynamicTimeout.attempts.should.above(0);
        if(dynamicTimeout.attempts == 3){
          dynamicTimeout.stop();
          dynamicTimeout.state.should.eqls(dynamicTimer.state.STOP);
          done();
        }
      });
      dynamicTimeout.start();
    })
  });

  describe('should paused', function(){
    it('after 3 attempts', function(done){
      var dynamicTimeout = dynamicTimer();
      dynamicTimeout.on('tick', function(){
        dynamicTimeout.attempts.should.above(0);
        if(dynamicTimeout.attempts == 3){
          dynamicTimeout.pause();
          dynamicTimeout.state.should.eqls(dynamicTimer.state.PAUSE);
          dynamicTimeout.stop();
          done();
        }
      });
      dynamicTimeout.start();
    })
  });

  describe('should resumed', function(){
    it('after be paused', function(done){
      var dynamicTimeout = dynamicTimer();
      dynamicTimeout.on('tick', function(){
        dynamicTimeout.attempts.should.above(0);
        if(dynamicTimeout.attempts == 3){
          dynamicTimeout.pause();
          dynamicTimeout.state.should.eqls(dynamicTimer.state.PAUSE);
          setTimeout(function(){
            dynamicTimeout.resume();
            dynamicTimeout.state.should.eqls(dynamicTimer.state.RUNNING);
            dynamicTimeout.stop();
          }, 3000)
          done();
        }
      });
      dynamicTimeout.start();
    })
  });

  describe('should listening `toll`', function(){
    it('when state change', function(done){
      var dynamicTimeout = dynamicTimer();
      var count = 0;
      dynamicTimeout.on('toll', function(){
        expect([
          dynamicTimer.state.PAUSE,
          dynamicTimer.state.RESUME,
          dynamicTimer.state.STOP
        ]).to.include(dynamicTimeout.state);
        count++;
        if(count == 3){
          done();
        }
      });
      dynamicTimeout.start();
      setTimeout(function(){
        dynamicTimeout.pause();
      }, 3000);
      setTimeout(function(){
        dynamicTimeout.resume();
      }, 4000);
      setTimeout(function(){
        dynamicTimeout.stop();
      }, 6000);
    })
  });
});