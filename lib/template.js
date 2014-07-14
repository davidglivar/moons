/** @module {Function} moons/lib/template **/

/**
 * Simple templating function with Handlebars '{{}}' syntax.
 * @example
 *  var temp = '{{name.first}} {{name.last}}, {{age}}';
 *  var map = { name: { first: 'David', last: 'Glivar' }, age: 29 };
 *  template(temp, map);
 *  => 'David Glivar, 29'
 * @public
 * @type {Function}
 * @param {string} t - The unparsed template
 * @param {Object} map - A map of values to place into the template
 * @param {boolean} fragment - Flag to return a document Element
 * @returns {string|Element} depending on fragment value
 */
var template = function (t, map, fragment) {
  map = map || {};
  if (typeof t !== 'string') {
    throw new TypeError('Expected a string, got ' + typeof t);
  }
  var reg = /\{{2}(\w+\.?)+?\}{2}/g
    , matches = t.match(reg)
    , keymap = {}
    , items
    , dummy = document.createElement('div')
    , helper = function (m) {
        var value = map[items[0]];
        if (typeof value === 'undefined' || value === null) return m;
        if (items.length > 1) {
          for (var i = 1, l = items.length; i < l; i++) {
            value = value[items[i]];
          }
        }
        return value;
      };
  if (!matches) {
    if (fragment) {
      dummy.innerHTML = t;
      t = dummy.firstChild;
    }
    return t;
  }
  for (var i = 0, l = matches.length; i < l; i++) {
    keymap[matches[i]] = matches[i].replace(/(^\{{2}|\}{2}$)/g, '').split('.');
  }
  for (var key in keymap) {
    items = keymap[key];
    t = t.replace(new RegExp(key, 'g'), helper);
  }
  if (fragment) {
    dummy.innerHTML = t;
    t = dummy.firstChild;
  }
  return t;
};

/**
 * In the event that a plugin requires a precompiled template (typeahead.js)
 * the following will curry the passed template into a new function, ready to
 * accept a mapped object.
 * @example
 *  var temp = '{{name.first}} {{name.last}}, {{age}}';
 *  var map = { name: { first: 'David', last: 'Glivar' }, age: 29 };
 *  var compile = template.precompile(temp);
 *  compile(map);
 *  => 'David Glivar, 29'
 * @public
 * @type {Function}
 * @param {string} t - The unparsed template
 * @param {Object} map - A map of values to place into the template
 * @returns {Function}
 */
template.precompile = function (t) {
  return function (map) {
    return template(t, map);
  };
};

module.exports = template;
