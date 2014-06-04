/** @module {Function} moons/renderer **/

/**
 * Module dependencies
 */
var core = require('./core');

function Renderer(opts) {
  opts = opts || {};

  if (typeof Renderer.instance === 'object') {
    return Renderer.instance;
  }

  this._calls = [];

  this._rid = null;

  this._stopped = false;

  this.update = this.update.bind(this);
}

Renderer.prototype.exists = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  return this._calls.indexOf(func) >= 0;
};

Renderer.prototype.update = function () {
  if (this._stopped) return;
  var i = 0
    , l = this._calls.length;
  for (i; i < l; i++) {
    this._calls[i]();
  }
  core.rAF(this.update);
};

Renderer.instance = undefined;

Renderer.add = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  if (Renderer.instance.exists(func)) return false;
  Renderer.instance._calls.push(func);
  return Renderer.instance;
};

Renderer.create = function (opts) {
  Renderer.instance = new Renderer(opts);
  return Renderer.instance;
};

Renderer.destroy = function () {
  Renderer.stop();
  return Renderer.instance = undefined;
};

Renderer.remove = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  var idx = Renderer.instance._calls.indexOf(func);
  if (idx < 0) return false;
  Renderer.instance._calls.splice(idx, 1);
  return Renderer.instance;
};

Renderer.start = function () {
  Renderer.instance._stopped = false;
  Renderer.instance._rid = core.rAF(Renderer.instance.update);
};

Renderer.stop = function () {
  Renderer.instance._stopped = true;
  core.cAF(Renderer.instance._rid);
};

module.exports = Renderer;
