var Renderer = require('../moons/renderer');

describe('Renderer', function () {
  
  it('is a function', function () {
    expect(Renderer).to.be.a('function');
  });

  describe('instance methods/props', function () {
    
    describe('#exists()', function () {
      it('write some tests');
    });

    describe('#update()', function () {
      it('write some tests');
    });
  });

  describe('static methods/props', function () {

    describe('instance', function () {
      
      it('exists and is undefined', function () {
        expect(Renderer).to.have.property('instance');
        expect(typeof Renderer.instance).to.be('undefined');
      });
    });

    describe('#add()', function () {
      it('write some tests');
    });

    describe('#create()', function () {
      it('write some tests');
    });

    describe('#destroy()', function () {
      it('write some tests');
    });

    describe('#remove()', function () {
      it('write some tests');
    });

    describe('#start()', function () {
      it('write some tests');
    });

    describe('#stop()', function () {
      it('write some tests');
    });
  });
});
