/**
 * Backbone Router (extracted without deps)
 *
 * Copyright (c) 2010-2014 Jeremy Ashkenas, DocumentCloud
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

var EventEmitter = require('events').EventEmitter
  , _history = require('./history');

var _escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g
  , _namedParam = /(\(\?)?:\w+/g
  , _optionalParam = /\((.*?)\)/g
  , _splatParam = /\*\w+/g;

function Router(options) {
  EventEmitter.call(this);

  options = options || {};

  if (options.routes) this.routes = options.routes;

  this._bindRoutes();

  this.initialize.apply(this, arguments);
};

Router.prototype = Object.create(EventEmitter.prototype);
Router.prototype.constructor = Router;

Router.prototype.initialize = function () {};

Router.prototype.route = function (route, name, callback) {
  if (Object.prototype.toString.call(route) !== '[object RegExp]') {
    route = this._routeToRegExp(route);
  }
  if (typeof name === 'function') {
    callback = name;
    name = '';
  }
  if (!callback) callback = this[name];
  var router = this;
  _history.route(route, function (fragment) {
    var args = router._extractParameters(route, fragment);
    router.execute(callback, args);
    router.emit.apply(router, ['route:' + name].concat(args));
    router.emit('route', name, args);
    _history.emit('route', router, name, args);
  });
  return this;
};

Router.prototype.execute = function (callback, args) {
  if (callback) callback.apply(this, args);
};

Router.prototype.navigate = function (fragment, options) {
  _history.navigate(fragment, options);
  return this;
};

Router.prototype._bindRoutes = function () {
  if (!this.routes) return;
  if (typeof this.routes === 'function') {
    this.routes = this.routes.call(this);
  }
  var route
    , routes = Object.keys(this.routes);
  while ((route = routes.pop()) != null) {
    this.route(route, this.routes[route]);
  }
};

Router.prototype._routeToRegExp = function (route) {
  route = route.replace(_escapeRegExp, '\\$&')
    .replace(_optionalParam, '(?:$1)?')
    .replace(_namedParam, function (match, optional) {
      return optional ? match : '([^/?]+)';
    })
    .replace(_splatParam, '([^?]*?)');
  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
};

Router.prototype._extractParameters = function (route, fragment) {
  var params = route.exec(fragment).slice(1);
  return params.map(function (param, i) {
    if (i === params.length - 1) return param || null;
    return param ? decodeURIComponent(param) : null;
  });
};

module.exports = Router;
