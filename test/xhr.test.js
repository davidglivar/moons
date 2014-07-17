var xhr = require('../lib/xhr')
  , sinon = require('sinon');

describe('xhr', function () {

  describe('get', function () {
    
    it('is a function', function () {
      expect(xhr.get).to.be.a('function');
    });
  });
});
