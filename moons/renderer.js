/** @module {Function} moons/renderer **/

/**
 * Module dependencies
 */
var core = require('./core');

var renderer = {

  _calls: [],

  _rid: null,

  _stopped: true,

  add: function (func) {
    if (typeof func !== 'function') {
      throw new TypeError('Expected a function, got ' + typeof func);
    }
    if (this.exists(func)) return false;
    this._calls.push(func);
    return true;
  },

  exists: function (func) {
    if (typeof func !== 'function') {
      throw new TypeError('Expected a function, got ' + typeof func);
    }
    return this._calls.indexOf(func) >= 0;
  },

  remove: function (func) {
    if (typeof func !== 'function') {
      throw new TypeError('Expected a function, got ' + typeof func);
    }
    var idx = this._calls.indexOf(func);
    if (idx < 0) return false;
    this._calls.splice(idx, 1);
    return true;
  },

  start: function () {
    if (!this._stopped) return false;
    this._stopped = false;
    this._rid = core.rAF(this.update.bind(this));
    return true;
  },

  stop: function () {
    if (this._stopped) return false;
    this._stopped = true;
    core.cAF(this._rid);
    return true;
  },

  update: function () {
    if (this._stopped) return;
    var i = 0
      , l = this._calls.length;
    for (i; i < l; i++) {
      this._calls[i]();
    }
    core.rAF(this.update.bind(this));
  }
};

module.exports = renderer;
