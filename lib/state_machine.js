/** @module {Function} moons/lib/state_machine **/

/**
 * Module dependencies
 */
var core = require('./core')
  , EventEmitter = require('events').EventEmitter;

/**
 * Helper method, converts passed character to upper case
 * @private
 * @param {string} s - The string to upcase
 * @returns {string}
 */
function upcase(s) {
  return s.toUpperCase();
}

/**
 * A simple state machine, allows for unstrict transitions
 * @example
 *  var machine = new StateMachine({
 *    onInitialize: function () {
 *      console.log('init');
 *    }
 *  });
 *  machine.setState('initialize');
 * @constructor
 * @augments {EventEmitter}
 * @param {Object} [states={}] - Optional states initialization object
 */
function StateMachine(states) {
  EventEmitter.call(this);

  /**
   * The current state
   * @member {string}
   * @public
   */
  this.state = null;

  /**
   * Namespace for on/off state callbacks
   * @member {Object}
   * @public
   */
  this.states = states || {};
}

StateMachine.prototype = Object.create(EventEmitter.prototype);
StateMachine.prototype.constructor = StateMachine;

/**
 * Changes the current state of the machine, if the current state is already
 * equal to the requested state change no callbacks are called.
 * @method
 * @public
 * @param {string} state - The state to transition to
 * @returns {boolean}
 */
StateMachine.prototype.setState = function (state) {
  var offState
    , onState
    , payload = Array.prototype.slice.call(arguments, 1)
    , re = /^\w/;
  if (core.isEmpty(this.state) || this.state !== state) {
    onState = this.states['on' + state.replace(re, upcase)];
    if (!core.isEmpty(this.state)) {
      offState = this.states['off' + this.state.replace(re, upcase)];
    }
    this.state = state;
    this.emit('STATE_CHANGE', this.state);
    if (typeof onState === 'function') onState.apply(this, payload);
    if (typeof offState === 'function') offState.apply(this, payload);
    return true;
  }
  return false;
};

module.exports = StateMachine;
