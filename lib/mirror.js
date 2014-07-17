/** @module {Function} moons/lib/mirror **/

/**
 * Creates an immutable object with key value pairs given a prefix and an Array
 * of strings. Very useful for creating constant values for global events.
 * @example
 *  var constants = mirror('APP', ['INIT', 'READY']);
 *  => { INIT: 'APP:INIT', READY: 'APP:READY' }
 *  constants.INIT
 *  => 'APP:INIT'
 * @public
 * @param {string} pre - A unique prefix to add to the key
 * @param {Array} arr - An array of strings to be used as keys
 * @returns {Object} - A sealed and immutable object
 */
function mirror(pre, arr) {
  if (typeof arr === 'string') arr = [arr];
  var o = {}
    , i = 0
    , l = arr.length;
  for (i; i < l; i++) {
    Object.defineProperty(o, arr[i], {
      value: pre + ':' + arr[i],
      writable: false
    });
  }
  return Object.seal(o);
}

module.exports = mirror;
