/** @module {Function} moons/lib/dispatcher **/

/**
 * Module dependencies
 */
var Promise = require('es6-promise').Promise;

/**
 * @constructor
 */
function Dispatcher() {

  /**
   * @member {Array}
   * @private
   */
  this._callbacks = [];
}

/**
 * Filters registered callbacks on a given action
 * @method
 * @private
 * @param {string} action - The action to filter upon
 * @returns {Array}
 */
Dispatcher.prototype._filterCallbacks = function (action) {
  return this._callbacks.filter(function (callback) {
    return callback.action === action;
  }).map(function (callback) {
    return callback.callback;
  });
};

/**
 * Dipatches the an action to a filtered group of registered callbacks
 * @method
 * @public
 * @param {string} action - The action to dispatch
 * @param {*} [payload] - An optional payload to pass to registered callbacks
 * @returns {Promise}
 */
Dispatcher.prototype.dispatch = function (action, payload) {
  return Promise.all(
    this._filterCallbacks(action).map(function (callback) {
      return callback.call(callback, payload);
    })
  );
};

/**
 * Used to register a callback with a given action
 * @method
 * @public
 * @param {string} action - The action to which to register
 * @param {function} callback - The callback associated with the given action
 * @returns {number} - The index of the registered callback
 */
Dispatcher.prototype.register = function (action, callback) {
  this._callbacks.push({
    action: action,
    callback: callback
  });
  return this._callbacks.length - 1;
};

module.exports = Dispatcher;
