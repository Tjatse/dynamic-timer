var chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  dynamicTimer = require('../');

describe('options', function(){
  describe('delay should set to default when', function(){
    it('undefined', function(){
      var dynamicTimeout = dynamicTimer();
      dynamicTimeout.options.delay.should.eqls(1000);
    });
    it('not a number', function(){
      var dynamicTimeout = dynamicTimer({
        delay: 'delay'
      });
      dynamicTimeout.options.delay.should.eqls(1000);
    });
  });

  describe('seed should set to default when', function(){
    it('undefined', function(){
      var dynamicTimeout = dynamicTimer();
      dynamicTimeout.options.seed.should.eqls(1000);
    });
    it('not a number', function(){
      var dynamicTimeout = dynamicTimer({
        seed: 'seed'
      });
      dynamicTimeout.options.seed.should.eqls(1000);
    });
  });

  describe('strategy should be set correct when', function(){
    it('undefined', function(){
      var dynamicTimeout = dynamicTimer();
      dynamicTimeout.options.strategy.should.eqls(dynamicTimer.strategy.DAYAN);
    });
    it('scribbled', function(){
      var dynamicTimeout = dynamicTimer({
        strategy: 'scribbled'
      });
      dynamicTimeout.options.strategy.should.eqls(dynamicTimer.strategy.DAYAN);
    });
    it('exactitude', function(){
      var dynamicTimeout = dynamicTimer({
        strategy: 'fibonacci'
      });
      dynamicTimeout.options.strategy.should.eqls(dynamicTimer.strategy.FIBONACCI);
    })
  });

  describe('maxAttempts undefined', function(){
    var limits = {
      'procession':   5000,
      'dayan':        141,
      'fibonacci':    20,
      'lucas':        19
    };
    for(var k in limits){
      var strategy = dynamicTimer.strategy[k.toUpperCase()];
      it('should equals ' + limits[k] + ' when strategy is `' + strategy + '`', function(){
        var dynamicTimeout = dynamicTimer({
          strategy: this.strategy
        });
        dynamicTimeout.options.maxAttempts.should.eqls(this.limit);
      }.bind({strategy: strategy, limit: limits[k]}));
    }
  });

  describe('maxAttempts is even set to infinity', function(){
    var limits = {
      'procession':   5000,
      'dayan':        141,
      'fibonacci':    20,
      'lucas':        19
    };
    for(var k in limits){
      var strategy = dynamicTimer.strategy[k.toUpperCase()];
      it('should equals ' + limits[k] + ' when strategy is `' + strategy + '`', function(){
        var dynamicTimeout = dynamicTimer({
          strategy: this.strategy,
          maxAttempts: Infinity
        });
        dynamicTimeout.options.maxAttempts.should.eqls(this.limit);
      }.bind({strategy: strategy, limit: limits[k]}));
    }
  });

  describe('maxAttempts is set less than limits', function(){
    var limits = {
      'procession':   5000,
      'dayan':        141,
      'fibonacci':    20,
      'lucas':        19
    };
    for(var k in limits){
      var strategy = dynamicTimer.strategy[k.toUpperCase()];
      it('should less than ' + limits[k] + ' when strategy is `' + strategy + '`', function(){
        var dynamicTimeout = dynamicTimer({
          strategy: this.strategy,
          maxAttempts: 10
        });
        dynamicTimeout.options.maxAttempts.should.eqls(10);
      }.bind({strategy: strategy}));
    }
  });

  describe('maxDelay should set to Infinity when', function(){
    it('undefined', function(){
      var dynamicTimeout = dynamicTimer();
      dynamicTimeout.options.maxDelay.should.eqls(Infinity);
    });
    it('not a number', function(){
      var dynamicTimeout = dynamicTimer({
        maxDelay: 'maxDelay'
      });
      dynamicTimeout.options.maxDelay.should.eqls(Infinity);
    });
  });

  describe('overrun should be set correct when', function(){
    it('undefined', function(){
      var dynamicTimeout = dynamicTimer();
      dynamicTimeout.options.overrun.should.eqls(dynamicTimer.state.OVERLOAD);
    });
    it('scribbled', function(){
      var dynamicTimeout = dynamicTimer({
        overrun: 'scribbled'
      });
      dynamicTimeout.options.overrun.should.eqls(dynamicTimer.state.OVERLOAD);
    });
    it('exactitude', function(){
      var dynamicTimeout = dynamicTimer({
        overrun: 'stop'
      });
      dynamicTimeout.options.overrun.should.eqls(dynamicTimer.state.STOP);
    })
  });

  describe('autostart shoud be set correct when', function(){
    it('undefined', function(){
      var dynamicTimeout = dynamicTimer();
      expect(dynamicTimeout.options.autostart).to.not.be.ok;
    });
    it('enabled', function(done){
      var dynamicTimeout = dynamicTimer({
        autostart: true
      });
      dynamicTimeout.on('tick', function(){
        dynamicTimeout.attempts.should.above(0);
        expect(dynamicTimeout.options.autostart).to.be.ok;
        dynamicTimeout.stop();
        done();
      });
    })
  });
})