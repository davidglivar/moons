/** @module {Function} moons/lib/flux_application **/

/**
 * Module dependencies
 */
var Bus = require('./bus')
  , Dispatcher = require('./dispatcher')
  , StateMachine = require('./state_machine');

function FluxApplication() {
  StateMachine.call(this);

  /**
   * @member {Dispatcher}
   * @public
   */
  this.dispatcher = new Dispatcher();

  /**
   * @member {Bus}
   * @public
   */
  this.input = new Bus();

  /**
   * @member {Bus}
   * @public
   */
  this.output = new Bus();
}

FluxApplication.prototype = Object.create(StateMachine.prototype);
FluxApplication.prototype.constructor = FluxApplication;

module.exports = FluxApplication;
