/** @module {Object} moons/core **/

/*!
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 * MIT license
 */

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
   * @method
   * @param {number} id - The id returned by core.rAF to cancel
   */
  cAF: (function () {
    if (window.cancelAnimationFrame) {
      return function () {
        window.cancelAnimationFrame.apply(window, arguments);
      };
    }
    var cAF
      , i = 0
      , l = _vendors.length;
    for (i; i < l && !cAF; i++) {
      cAF = window[_vendors[i] + 'CancelAnimationFrame'] ||
            window[_vendors[i] + 'CancelRequestAnimationFrame'];
    }
    if (!cAF) {
      cAF = function (id) {
        clearTimeout(id);
      };
    } else {
      cAF = function () {
        return cAF.apply(window, arguments);
      };
    }
    return cAF;
  }()),

  /**
   * Retrieve the (prefixed) style property given a normal property
   * @example
   *  var transition = core.prop('transition');
   * @public
   * @method
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
   * @method
   */
  rAF: (function () {
    if (window.requestAnimationFrame) {
      return function () {
        window.requestAnimationFrame.apply(window, arguments);
      };
    }
    var rAF
      , i = 0
      , l = _vendors.length;
    for (i; i < l && !rAF; i++) {
      rAF = window[_vendors[i] + 'RequestAnimationFrame'];
    }
    if (!rAF) {
      var lastTime = 0;
      rAF = function (callback) {
        var currTime = new Date().getTime()
          , timeToCall = Math.max(0, 16 - (currTime - lastTime))
          , id = setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    } else {
      rAF = function () {
        return rAF.apply(window, arguments);
      };
    }
    return rAF;
  }())
};

module.exports = core;
