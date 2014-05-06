/** @module {Object} moons/core **/

var _prefixes = ['webkit', 'Moz']
  , _styles = document.documentElement.style;

function toDash(s) {
  return s.replace(/([A-Z])/g, function (m) { return '-' + i.toLowerCase(); });
}

var core = {
  prop: function (p) {
    if (p in _styles) return toDash(p);
    var upped = p.charAt(0).toUpperCase() + p.substr(1)
      , i, l, _prop;
    for (i = 0, l = _prefixes.length; i < l; i++) {
      _prop = _prefixes[i] + upped;
      if (_prop in _styles) return _prop;
    }
    return null;
  }
};

module.exports = core;
