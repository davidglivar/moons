var mirror = require('../lib/mirror');

describe('mirror', function () {
  
  it('is a function', function () {
    expect(mirror).to.be.a('function');
  });

  it('returns an immutable object', function () {
    var result = mirror('test', ['test'])
      , test = result.test;
    expect(result).to.be.an('object');
    result.test = 'somethingelse';
    expect(result.test).to.be(test);
    result.invalid = 'anewthing';
    expect(typeof result.invalid).to.be('undefined');
  });

  it('creates a value from the given prefix and key', function () {
    var result = mirror('app', ['test']);
    expect(result.test).to.be('app:test');
  });

  it('accepts an array of strings as keys', function () {
    var func = function () {
      return mirror('test', ['init', 'ready']);
    };
    expect(func).to.not.throwError();
    expect(func()).to.be.an('object');
  });

  it('accepts a string for a singular key', function () {
    var func = function () {
      return mirror('test', 'init');
    };
    expect(func).to.not.throwError();
    expect(func()).to.be.an('object');
  });
});
