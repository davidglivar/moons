var core = require('../lib/core');

describe('core', function () {
  
  it('exists', function () {
    expect(core).to.be.ok();
    expect(core).to.be.an('object');
  });

  describe('#cAF()', function () {
    
    it('exists', function () {
      expect(core).to.have.property('cAF');
      expect(core.cAF).to.be.a('function');
      expect(core.cAF.length).to.be(1);
    });
  });

  describe('#clone()', function () {
    
    it('is a function on the core namespace', function () {
      expect(core).to.have.property('clone');
      expect(core.clone).to.be.a('function');
    });

    it('creates a copy of the passed object', function () {
      var o = { foo: true }
        , result = core.clone(o);
      expect(o === result).to.be(false);
      expect(o.foo === result.foo).to.be(true);
      expect(Object.keys(result)).to.eql(['foo']);
      expect(result).to.eql(o);
    });
  });

  describe('#extend()', function () {
    
    it('is a function on the core namespace', function () {
      expect(core).to.have.property('extend');
      expect(core.extend).to.be.a('function');
    });

    it('returns the original object if no sources are passed', function () {
      var o = { foo: true }
        , result = core.extend(o);
      expect(Object.keys(result).length).to.be(1);
      expect(result.foo).to.be(true);
    });

    it('overwrites existing properties in the original object from the source', function () {
      var o = { foo: true }
        , result = core.extend(o, { foo: false });
      expect(result.foo).to.be(false);
    });

    it('adds properties from sources into the original object', function () {
      var o = { foo: true }
        , result = core.extend(o, { bar: false });
      expect(result).to.have.keys('foo', 'bar');
      expect(result.foo).to.be(true);
      expect(result.bar).to.be(false);
    });

    it('extends the original object from multiple sources', function () {
      var o = { foo: true }
        , result = core.extend(o, { bar: false }, { foobar: 0 });
      expect(result).to.have.keys('foo', 'bar', 'foobar');
      expect(result.foo).to.be(true);
      expect(result.bar).to.be(false);
      expect(result.foobar).to.be(0);
    });

    it('does not modify the original object', function () {
      var o = { foo: true };
      core.extend(o, { bar: false });
      expect(o).to.not.have.property('bar');
    });
  });

  describe('#prop()', function () {
    
    it('exists', function () {
      expect(core).to.have.property('prop');
      expect(core.prop).to.be.a('function');
      expect(core.prop.length).to.be(1);
    });

    it('returns null for an invalid property', function () {
      expect(core.prop('notrealatall')).to.be(null);
    });

    it('returns a valid property', function () {
      var height = core.prop('height')
        , transform = core.prop('transform');
      expect(height).to.be('height');
      expect(transform).to.be('-webkit-transform');
    });
  });

  describe('#rAF()', function () {

    it('exists', function () {
      expect(core).to.have.property('rAF');
      expect(core.rAF).to.be.a('function');
      expect(core.rAF.length).to.be(1);
    });
  });
});
