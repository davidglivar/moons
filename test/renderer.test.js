var renderer = require('../moons/renderer');

describe('renderer', function () {
  
  it('is an object');

  describe('_calls', function () {
    it('is an array');
  });

  describe('_rid', function () {
    it('is a number');
  });

  describe('_stopped', function () {
    it('is a boolean');
  });

  describe('#add()', function () {
    it('throws a TypeError if you pass anything other than a function');
    it('adds a function to the call stack');
    it('does not add a function that already exists in the stack');
    it('returns a boolean');
  });

  describe('#exists()', function () {
    it('throws a TypeError if you pass anything other than a function');
    it('returns true if a function is in the call stack');
    it('returns false if a function is not in the call stack');
  });

  describe('#remove()', function () {
    it('throws a TypeError if you pass anything other than a function');
    it('returns false if the passed function is not found in the call stack');
    it('returns true for a function that is found and removed from the call stack');
  });

  describe('#start()', function () {
    it('returns false if the renderer is already started');
    it('returns true on successful start');
    it('flips renderer._stopped to false');
    it('stores the requestAnimationFrame id in renderer._rid');
  });

  describe('#stop()', function () {
    it('returns false if the renderer has already stopped');
    it('returns true on a successful stop');
    it('flips renderer._stopped to true');
    it('cancels the renderer._rid requestAnimationFrame id');
  });

  describe('#update()', function () {
    it('does not loop through the call stack if the renderer is stopped');
    it('calls each function in the call stack');
  });
});
