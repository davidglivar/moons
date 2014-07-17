/** @module {Function} moons/lib/bus **/

/**
 * Modeled after a computer bus, components can subscribe to the bus to begin
 * recieving outgoing messages.
 * @constructor
 */
function Bus() {

  /**
   * Array of subscriptions, is ammended with the recv method
   * @member {Array}
   * @private
   */
  this._subscriptions = [];
}

/**
 * Sends an action/message with an optional payload to all subscribed
 * components.
 * @method
 * @public
 * @param {string} action - The message/action to send
 * @param {*} [payload] - Arguments to pass to the subscription
 */
Bus.prototype.send = function (action, payload) {
  var i = 0
    , l = this._subscriptions.length;
  for (i; i < l; i++) {
    this._subscriptions[i].call(this._subscriptions[i], action, payload);
  }
};

/**
 * Used by subscribers to push a subscription function into the bus' queue
 * @method
 * @public
 * @param {Function} subscription - The subscriber's subscription function
 * @returns {boolean}
 */
Bus.prototype.recv = function (subscription) {
  if (typeof subscription === 'function') {
    this._subscriptions.push(subscription);
    return true;
  }
  return false;
};

module.exports = Bus;
