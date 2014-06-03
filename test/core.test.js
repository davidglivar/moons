var core = require('../lib/core');

describe('core', function () {
  
  it('exists', function () {
    expect(core).to.be.ok();
    expect(core).to.be.an('object');
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
});
