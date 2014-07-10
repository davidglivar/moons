var Debouncer = require('../moons/debouncer')
  , sinon = require('sinon');

var _d = null;

if (typeof Window === 'undefined') {
  Window = window.constructor;
}

function setup() {
  _d = new Debouncer({
    element: window,
    elementWithValue: document.body,
    event: 'scroll',
    value: 'scrollTop'
  });
}

function teardown() {
  _d = null;
}

describe('Debouncer', function () {

  beforeEach(setup);
  afterEach(teardown);
  
  it('is a function', function () {
    expect(Debouncer).to.be.a('function');
  });

  it('throws a TypeError if anything other than an object is passed into the constructor', function () {
    var f1 = function () { new Debouncer(); };
    var f2 = function () { new Debouncer('string'); };
    var f3 = function () { new Debouncer([]); };
    expect(f1).to.throwError(function (e) {
      expect(e).to.be.a(TypeError);
    });
    expect(f2).to.throwError(function (e) {
      expect(e).to.be.a(TypeError);
    });
    expect(f3).to.throwError(function (e) {
      expect(e).to.be.a(TypeError);
    });
  });

  describe('_calls', function () {

    it('is an array', function () {
      expect(_d).to.have.property('_calls');
      expect(_d._calls).to.be.an('array');
      expect(_d._calls.length).to.be(0);
    });
  });

  describe('_isTicking', function () {

    it('is a boolean and initializes as false', function () {
      expect(_d).to.have.property('_isTicking');
      expect(_d._isTicking).to.be.a('boolean');
      expect(_d._isTicking).to.be(false);
    });
  });

  describe('_last', function () {
    it('write some tests');
  });

  describe('element', function () {

    it('throws a TypeError in construction if value is not an Element', function () {
      var func = function () {
        new Debouncer({
          element: null,
          event: 'someEvent',
          value: 'someValue'
        });
      };
      expect(func).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });
  });

  describe('elementWithValue', function () {

    it('throws a TypeError in construction if value is not an Element', function () {
      var func = function () {
        new Debouncer({
          element: window,
          elementWithValue: {},
          event: 'someEvent',
          value: 'someValue'
        });
      };
      expect(func).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('defaults to `element` if not in initialization object', function () {
      var func = function () {
        return new Debouncer({
          element: window,
          event: 'someEvent',
          value: 'someValue'
        });
      };
      expect(func).to.not.throwError();
      var d = func();
      expect(d.elementWithValue).to.eql(d.element);
    });
  });

  describe('event', function () {
    
    it('throws a TypeError in construction if value is not a string', function () {
      var func = function () {
        new Debouncer({
          element: window,
          event: false,
          value: 'someValue'
        });
      };
      expect(func).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });
  });

  describe('value', function () {

    it('throws a TypeError in construction if value is not a string', function () {
      var func = function () {
        new Debouncer({
          element: window,
          event: 'someEvent',
          value: false
        });
      };
      expect(func).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });
  });

  describe('#_requestTick()', function () {

    it('calls #_update() if _isTicking is false', function (done) {
      var spy = sinon.spy(_d, '_update')
        , result;
      expect(_d._isTicking).to.be(false);
      result = _d._requestTick();
      setTimeout(function () {
        expect(spy.called).to.be(true);
        expect(result).to.be(true);
        expect(_d._isTicking).to.be(false);
        done();
      }, 100);
    });

    it('does not call #_update() if _isTicking is true', function (done) {
      var spy = sinon.spy(_d, '_update')
        , result;
      _d._isTicking = true;
      result = _d._requestTick();
      setTimeout(function () {
        expect(spy.called).to.be(false);
        expect(result).to.be(true);
        expect(_d._isTicking).to.be(true);
        done();
      }, 100);
    });
  });

  describe('#_update()', function () {

    it('sets _isTicking to false', function () {
      _d._isTicking = true;    
      _d._update();
      expect(_d._isTicking).to.be(false);
    });

    it('runs the call stack', function (done) {
      var spy = sinon.spy(_d, 'runStack')
        , func = sinon.spy();
      _d.attach(func);
      _d._update();
      setTimeout(function () {
        expect(spy.called).to.be(true);
        expect(func.called).to.be(true);
        done();
      }, 100);
    });
  });

  describe('#attach()', function () {
    it('write some tests');
    it('throws a TypeError if you pass anything other than a function');
  });

  describe('#detach()', function () {
    it('write some tests');
    it('throws a TypeError if you pass anything other than a function');
  });

  describe('#detachAll()', function () {
    it('write some tests');
  });

  describe('#exists()', function () {
    it('write some tests');
    it('throws a TypeError if you pass anything other than a function');
  });

  describe('#listen()', function () {
    it('write some tests');
  });

  describe('#runStack()', function () {
    it('write some tests');
  });

  describe('#stop()', function () {
    it('write some tests');
  });
});
