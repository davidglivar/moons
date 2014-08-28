/** @module {Object} moons/lib/renderer **/

/**
 * Module dependencies
 */
var core = require('./core');

/**
 * This object contains functionality for adding and removing functions to a 
 * call stack, which are executed on requestAnimationFrame.
 * @namespace
 */
var renderer = {

  /**
   * Array containing all functions added to the renderer
   * @private
   * @type {Array}
   */
  _calls: [],

  /**
   * Holds the value of the requestAnimationFrame call id
   * @private
   * @type {number}
   */
  _rid: null,

  /**
   * Flag representing if the renderer is running
   * @private
   * @type {boolean}
   */
  _stopped: true,

  _delta: 0,

  _frameCount: 0,

  _interval: (function () {
    return 1000 / this.framerate;
  }()),

  _now: null,

  _started: null,

  _then: null,
  
  fps: 0,

  framerate: 59,

  /**
   * Append a function to the call stack
   * @public
   * @method
   * @param {Function} func - The function to add
   * @returns {boolean}
   * @throws {TypeError}
   */
  add: function (func, scope) {
    if (typeof func !== 'function') {
      throw new TypeError('Expected a function, got ' + typeof func);
    }
    if (this.exists(func)) return false;
    func.__scope = scope || this;
    this._calls.push(func);
    return true;
  },

  /**
   * Checks to see if a function exists within the call stack
   * @public
   * @method
   * @param {Function} func - The function to check for
   * @returns {boolean}
   * @throws {TypeError}
   */
  exists: function (func) {
    if (typeof func !== 'function') {
      throw new TypeError('Expected a function, got ' + typeof func);
    }
    return this._calls.indexOf(func) >= 0;
  },

  /**
   * Removes a function from the call stack
   * @public
   * @method
   * @param {Function} func - The function to remove
   * @returns {boolean}
   * @throws {TypeError}
   */
  remove: function (func) {
    if (typeof func !== 'function') {
      throw new TypeError('Expected a function, got ' + typeof func);
    }
    var idx = this._calls.indexOf(func);
    if (idx < 0) return false;
    this._calls.splice(idx, 1);
    return true;
  },

  /**
   * Starts the renderer call loop
   * @public
   * @method
   * @returns {boolean}
   */
  start: function () {
    if (!this._stopped) return false;
    this._stopped = false;
    this._then = this._started = window.performance.now();
    this._interval = 1000 / this.framerate;
    this._rid = core.rAF(this.update.bind(this));
    return true;
  },

  /**
   * Stops the renderer call loop
   * @public
   * @method
   * @returns {boolean}
   */
  stop: function () {
    if (this._stopped) return false;
    this._stopped = true;
    core.cAF(this._rid);
    return true;
  },

  /**
   * Loops through the call stack and executes each function, recursively calls
   * itself on requestAnimationFrame unless the renderer has been stopped.
   * @public
   * @method
   */
  update: function (t) {
    if (this._stopped) return;

    core.rAF(this.update.bind(this));

    this._now = t;
    this._delta = this._now - this._then;
    if (this._delta > this._interval) {
      this._then = this._now - (this._delta % this._interval);
      this.fps = Math.round(1000 / ((this._now - this._started) / ++this._frameCount) * 100) / 100;
      var i = 0
        , l = this._calls.length;
      for (i; i < l; i++) {
        this._calls[i].call(this._calls[i].__scope);
      }
    }
  }
};

module.exports = renderer;
