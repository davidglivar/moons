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

    it('write some tests');
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
  });

  describe('#rAF()', function () {

    it('exists', function () {
      expect(core).to.have.property('rAF');
      expect(core.rAF).to.be.a('function');
      expect(core.rAF.length).to.be(1);
    });

    it('write some tests');
  });
});
