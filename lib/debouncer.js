/** @module {Function} moons/lib/debouncer **/

/**
 * Module dependencies
 */
var core = require('./core');

/**
 * General use event debouncing constructor. Debouncing is done off of the
 * requestAnimationFrame method
 * @example
 *  var scroller = new Debouncer({
 *    element: window,
 *    elementWithValue: document.body,
 *    event: 'scroll',
 *    value: 'scrollTop'
 *  });
 *  scroller.attach(myFunc);
 *  scroller.listen();
 * @constructor
 * @param {Object} spec - Initialization object
 * @param {Window|Element} spec.element - The element to which the listener is bound
 * @param {Window|Element} [spec.elementWithValue=spec.element] - The element with
 *  the changing value. This is common when binding to 'scroll'.
 * @param {string} spec.event - The event to bind to
 * @param {string} spec.value - The property name on elementWithValue that
 *  provides the updating value
 */
function Debouncer(spec) {
  
  if (!spec || typeof spec === 'undefined') {
    throw new TypeError('Expected an initialization object, got ' + typeof spec);
  }

  if (!spec.element || 
      // silly, but phantomjs uses DOMWindowConstructor instead of Window
      (!(spec.element instanceof (Window || DOMWindowConstructor)) &&
      !(spec.element instanceof Element))) {
    throw new TypeError(
        'Expected an Element, got ' + typeof spec.element 
      + ' with constructor ' + spec.element.constructor
    );
  }

  if (typeof spec.elementWithValue === 'undefined') {
    spec.elementWithValue = spec.element;
  } else if ((!(spec.elementWithValue instanceof (Window || DOMWindowConstructor)) &&
              !(spec.elementWithValue instanceof Element))) {
    throw new TypeError(
        'Expected an Element, got ' + typeof spec.elementWithValue 
      + ' with constructor ' + spec.elementWithValue.constructor
    );
  }

  if (typeof spec.event !== 'string') {
    throw new TypeError('Expected a string, got ' + typeof spec.event);
  }

  if (typeof spec.value !== 'string') {
    throw new TypeError('Expected a string, got ' + typeof spec.value);
  }

  /**
   * The call stack containing attached functions
   * @member {Array}
   * @private
   */
  this._calls = [];

  /**
   * Boolean flag bounced off of requestAnimationFrame
   * @member {boolean}
   * @private
   */
  this._isTicking = false;

  /**
   * The last known value broadcast on the debounced event
   * @member {*}
   * @private
   */
  this._last = null;

  /**
   * The element to which the event is bound
   * @member {Element|Window}
   * @public
   */
  this.element = spec.element;

  /**
   * The element with the property/value that should be passed to the call stack
   * @member {Element|Window}
   * @public
   */
  this.elementWithValue = spec.elementWithValue || spec.element;

  /**
   * The event to attach
   * @member {string}
   * @public
   */
  this.event = spec.event;

  /**
   * The property key to be accessed on elementWithValue
   * @member {string}
   * @public
   */
  this.value = spec.value;

  this._requestTick = this._requestTick.bind(this);
  this._update = this._update.bind(this);
}

/**
 * Internal method for main debouncing logic
 * @method
 * @private
 * @returns {boolean}
 */
Debouncer.prototype._requestTick = function () {
  this._last = this.elementWithValue[this.value];
  if (!this._isTicking) {
    core.rAF(this._update);
  }
  return this._isTicking = true;
};

/**
 * Internal update method run on rAF, runs the stack and flips the ticking flag
 * @method
 * @private
 */
Debouncer.prototype._update = function () {
  this._isTicking = false;
  this.runStack(this._last);
};

/**
 * Attaches a function to the bound event by placing it in a call stack
 * @method
 * @public
 * @param {Function} func - The function to queue in the call stack
 * @returns {Debouncer}
 * @throws {TypeError}
 */
Debouncer.prototype.attach = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  if (this.exists(func)) return false;
  this._calls.push(func);
  return this;
};

/**
 * Detaches a function from the bound event by splicing it from the call stack
 * @method
 * @public
 * @param {Function} func - The function to remove from the call stack
 * @returns {Debouncer}
 * @throws {TypeError}
 */
Debouncer.prototype.detach = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  var idx = this._calls.indexOf(func);
  if (idx < 0) return false;
  this._calls.splice(idx, 1);
  return this;
};

/**
 * Safely removes each function from the call stack
 * @method
 * @public
 * @returns {Debouncer}
 */
Debouncer.prototype.detachAll = function () {
  var i = 0
    , l = this._calls.length;
  for (i; i < l; i++) {
    this.detach(this._calls[i]);
  }
  return this;
};

/**
 * Checks for the given function in the call stack
 * @method
 * @public
 * @param {Function} func - The function for which to check
 * @returns {boolean}
 * @throws {TypeError}
 */
Debouncer.prototype.exists = function (func) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function, got ' + typeof func);
  }
  return this._calls.indexOf(func) >= 0;
};

/**
 * Bind to the event defined in the Debouncer constructor
 * @method
 * @public
 * @returns {Debouncer}
 */
Debouncer.prototype.listen = function () {
  this.element.addEventListener(this.event, this._requestTick, false);
  return this;
};

/**
 * Runs the full call stack with a given value
 * @method
 * @public
 * @param {*} current - The value to pass to each function in the stack
 */
Debouncer.prototype.runStack = function (current) {
  var i = 0
    , l = this._calls.length;
  for (i; i < l; i++) {
    this._calls[i](current);
  }
};

/**
 * Removes the event binding, but does not detach any functions from the stack
 * @method
 * @public
 * @returns {Debouncer}
 */
Debouncer.prototype.stop = function () {
  this.element.removeEventListener(this.event, this._requestTick, false);
  return this;
};

module.exports = Debouncer;
