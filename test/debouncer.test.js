var Debouncer = require('../moons/debouncer');

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

  it('throws a TypeError if anything other than an object is passed into the constructor');

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
      //var func = function () {
        //new Debouncer({
          //element: window,
          //elementWithValue: {},
          //event: 'someEvent',
          //value: 'someValue'
        //});
      //};
      //expect(func).to.throwError(function (e) {
        //expect(e).to.be.a(TypeError);
      //});
    });
    it('defaults to `element` if not in initialization object');
  });

  describe('event', function () {
    it('write some tests');
  });

  describe('value', function () {
    it('write some tests');
  });

  describe('#_requestTick()', function () {
    it('write some tests');
  });

  describe('#_update()', function () {
    it('write some tests');
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
