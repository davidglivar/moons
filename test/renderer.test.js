var renderer = require('../lib/renderer')
  , sinon = require('sinon');

describe('renderer', function () {
  
  it('is an object', function () {
    expect(renderer).to.be.an('object');
  });

  describe('_calls', function () {

    it('is an array', function () {
      expect(renderer).to.have.property('_calls');
      expect(renderer._calls).to.be.an('array');
    });
  });

  describe('_rid', function () {

    it('is a number', function () {
      expect(renderer).to.have.property('_rid');
      expect(renderer._rid).to.be(null);
      renderer.start();
      expect(renderer._rid).to.be.a('number');
      renderer.stop();
    });
  });

  describe('_stopped', function () {

    it('is a boolean', function () {
      expect(renderer).to.have.property('_stopped');
      expect(renderer._stopped).to.be(true);
      renderer.start();
      expect(renderer._stopped).to.be(false);
      renderer.stop();
      expect(renderer._stopped).to.be(true);
    });
  });

  describe('#add()', function () {

    it('throws a TypeError if you pass anything other than a function', function () {
      var invalid = function () { renderer.add(); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.add([]); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.add({}); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.add('a string'); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.add(123); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.add(false); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.add(null); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('does not throw an error if you pass a function', function () {
      var valid = function () {
        renderer.add(function () {});
      };
      expect(valid).to.not.throwError();
      renderer._calls = []; // reset
    });

    it('adds a function to the call stack', function () {
      var func = function () {};
      renderer.add(func);
      expect(renderer._calls.indexOf(func)).to.not.be.below(0);
      renderer._calls = []; // reset
    });

    it('does not add a function that already exists in the stack', function () {
      var func = function () {}
        , result;
      renderer.add(func);
      expect(renderer._calls.length).to.be(1);
      result = renderer.add(func);
      expect(renderer._calls.length).to.be(1);
      expect(result).to.be(false);
      renderer._calls = []; // reset
    });

    it('returns a boolean', function () {
      var func = function () {};
      expect(renderer.add(func)).to.be(true);
      expect(renderer.add(func)).to.be(false);
      renderer._calls = []; // reset
    });
  });

  describe('#exists()', function () {

    it('throws a TypeError if you pass anything other than a function', function () {
      var invalid = function () { renderer.exists(); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.exists([]); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.exists({}); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.exists('a string'); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.exists(123); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.exists(false); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.exists(null); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('does not throw an error if you pass a function', function () {
      var valid = function () { renderer.exists(function () {}); };
      expect(valid).to.not.throwError();
    });

    it('returns true if a function is in the call stack', function () {
      var func = function () {};
      expect(renderer._calls.length).to.be(0);
      renderer.add(func);
      expect(renderer._calls.length).to.be(1);
      expect(renderer.exists(func)).to.be(true);
      renderer._calls = []; // reset
    });

    it('returns false if a function is not in the call stack', function () {
      var func = function () {};
      expect(renderer._calls.length).to.be(0);
      expect(renderer.exists(func)).to.be(false);
    });
  });

  describe('#remove()', function () {

    it('throws a TypeError if you pass anything other than a function', function () {
      var invalid = function () { renderer.remove(); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.remove([]); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.remove({}); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.remove('a string'); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.remove(123); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.remove(false); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });

      invalid = function () { renderer.remove(null); };
      expect(invalid).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('does not throw an error if you pass a function', function () {
      var valid = function () { renderer.remove(function () {}); };
      expect(valid).to.not.throwError();
    });

    it('returns false if the passed function is not found in the call stack', function () {
      renderer._calls = [];    
      expect(renderer.remove(function () {})).to.be(false);
    });

    it('returns true for a function that is found and removed from the call stack', function () {
      var func = function () {}
        , result;
      renderer._calls = [];
      renderer.add(func);
      expect(renderer._calls.length).to.be(1);
      result = renderer.remove(func);
      expect(result).to.be(true);
      expect(renderer._calls.indexOf(func)).to.be(-1);
      expect(renderer._calls.length).to.be(0);
    });
  });

  describe('#start()', function () {

    it('returns false if the renderer is already started', function () {
      var result;
      renderer.stop();    
      expect(renderer._stopped).to.be(true);
      renderer.start();
      expect(renderer._stopped).to.be(false);
      result = renderer.start();
      expect(result).to.be(false);
      renderer.stop();
    });

    it('returns true on successful start', function () {
      var result;
      expect(renderer._stopped).to.be(true);
      result = renderer.start();
      expect(result).to.be(true);
      renderer.stop();
    });

    it('flips renderer._stopped to false', function () {
      renderer.stop();
      expect(renderer._stopped).to.be(true);
      renderer.start();
      expect(renderer._stopped).to.be(false);
      renderer.stop();
    });

    it('stores the requestAnimationFrame id in renderer._rid', function () {
      var rid = renderer._rid;
      expect(rid).to.be.a('number');
      renderer.stop();
      renderer.start();
      expect(renderer._rid).to.be.a('number');
      expect(renderer._rid).to.not.be(rid);
      renderer.stop();
    });
  });

  describe('#stop()', function () {

    it('returns false if the renderer has already stopped', function () {
      var result;
      renderer.start();
      expect(renderer.stop()).to.be(true);
      result = renderer.stop();
      expect(result).to.be(false);
    });

    it('returns true on a successful stop', function () {
      renderer.stop();
      renderer.start();
      expect(renderer._stopped).to.be(false);
      expect(renderer.stop()).to.be(true);
    });

    it('flips renderer._stopped to true', function () {
      renderer.stop();    
      renderer.start();
      expect(renderer._stopped).to.be(false);
      renderer.stop();
      expect(renderer._stopped).to.be(true);
    });
  });

  describe('#update()', function () {

    it('does not loop through the call stack if the renderer is stopped', function (done) {
      var func = sinon.spy();
      renderer._calls = [];
      renderer.add(func);
      renderer.start();
      setTimeout(function () {
        var count = func.callCount;
        renderer.stop();
        expect(count).to.be.above(0);
        setTimeout(function () {
          expect(count).to.be(func.callCount);
          done();
        }, 200);
      }, 200);
    });

    it('calls each function in the call stack', function (done) {
      var func1 = sinon.spy()
        , func2 = sinon.spy();
      renderer._calls = [];
      renderer.add(func1);
      renderer.add(func2);
      expect(renderer._calls.length).to.be(2);
      expect(func1.called).to.be(false);
      expect(func2.called).to.be(false);
      renderer.start();
      setTimeout(function () {
        renderer.stop();
        renderer._calls = [];
        expect(func1.called).to.be(true);
        expect(func2.called).to.be(true);
        done();
      }, 200);
    });
  });
});
