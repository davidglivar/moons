/** @module {Function} moons/debouncer **/

/**
 * Module dependencies
 */
var core = require('./core');

function Debouncer(spec) {

  this._calls = [];

  this._isTicking = false;

  this._last = null;

  this.element = spec.element;

  this.elementWithValue = spec.elementWithValue || spec.element;

  this.event = spec.event;

  this.value = spec.value;

  this._requestTick = this._requestTick.bind(this);
}

Debouncer.prototype._requestTick = function () {
  this._last = this.elementWithValue[this.value];
  if (!this._isTicking) {
    core.rAF(this._update.bind(this));
  }
  return this._isTicking = true;
};

Debouncer.prototype._update = function () {
  this._isTicking = false;
  this.runStack(this._last);
};

Debouncer.prototype.attach = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  if (this.exists(func)) return false;
  this._calls.push(func);
  return this;
};

Debouncer.prototype.detach = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  var idx = this._calls.indexOf(func);
  if (idx < 0) return false;
  this._calls.splice(idx, 1);
  return this;
};

Debouncer.prototype.detachAll = function () {
  var i = 0
    , l = this._calls.length;
  for (i; i < l; i++) {
    this.detach(this._calls[i]);
  }
  return this;
};

Debouncer.prototype.exists = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  return this._calls.indexOf(func) >= 0;
};

Debouncer.prototype.listen = function () {
  this.element.addEventListener(this.event, this._requestTick, false);
};

Debouncer.prototype.runStack = function (current) {
  var i = 0
    , l = this._calls.length;
  for (i; i < l; i++) {
    this._calls[i](current);
  }
};

Debouncer.prototype.stop = function () {
  this.element.removeEventListener(this.event, this._requestTick, false);
};

module.exports = Debouncer;
