/** @module {Object} moons/core **/

var _prefixes = ['webkit', 'Moz']
  , _styles = document.documentElement.style
  , _vendors = ['ms', 'moz', 'webkit', 'o'];

function toDash(s) {
  s = s.replace(/([A-Z])/g, function (m) { return '-' + m.toLowerCase(); });
  if (s.charAt(0) !== '-') s = '-' + s;
  return s;
}

/**
 * @namespace
 */
var core = {

  /**
   * Vendor helper for cancelAnimationFrame
   * @example
   *  var requestID = core.rAF(function () {});
   *  core.cAF(requestID);
   * @public
   * @param {number} id - The id returned by core.rAF to cancel
   */
  cAF: (function () {
    if (window.cancelAnimationFrame) return window.cancelAnimationFrame;
    var cAF
      , i = 0
      , l = _vendors.length;
    for (i; i < l && !cAF; i++) {
      cAF = window[_vendors[i] + 'CancelAnimationFrame'] ||
            window[_vendors[i] + 'CancelRequestAnimationFrame'];
    }
  }()),

  /**
   * Retrieve the (prefixed) style property given a normal property
   * @example
   *  var transition = core.prop('transition');
   * @public
   * @param {string} p - The property to retrieve
   * @returns {string}
   */
  prop: function (p) {
    if (p in _styles) return toDash(p);
    var upped = p.charAt(0).toUpperCase() + p.substr(1)
      , i, l, _prop;
    for (i = 0, l = _prefixes.length; i < l; i++) {
      _prop = _prefixes[i] + upped;
      if (_prop in _styles) return toDash(_prop);
    }
    return null;
  },

  /**
   * Vendor helper for requestAnimationFrame
   * @example
   *  var requestID = core.rAF(function () {});
   * @public
   */
  rAF: (function () {
    if (window.requestAnimationFrame) return window.requestAnimationFrame;
    var rAF
      , i = 0
      , l = _vendors.length;
    for (i; i < l && !rAF; i++) {
      rAF = window[_vendors[i] + 'RequestAnimationFrame'];
    }
    return rAF;
  }())
};

module.exports = core;
