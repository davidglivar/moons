/**
 * Backbone History (extracted without deps)
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

var core = require('./core')
  , EventEmitter = require('events').EventEmitter;

var _isExplorer = /msie [\w.]+/
  , _pathStripper = /#.*$/
  , _rootStripper = /^\/+|\/+$/g
  , _routeStripper = /^[#\/]|\s+$/g
  , _trailingSlash = /\/$/;

function History() {
  EventEmitter.call(this);

  this.handlers = [];

  this.history = window.history;

  this.location = window.location;

  this.checkUrl = this.checkUrl.bind(this);

  this.on('checkUrl', this.checkUrl);
}

History.prototype = Object.create(EventEmitter.prototype);
History.prototype.constructor = History;

History.started = false;

History.prototype.interval = 50;

History.prototype.atRoot = function () {
  return this.location.pathname.replace(/[^\/]$/, '$&') === this.root;
};

History.prototype.getHash = function (window) {
  var match = (window || this).location.href.match(/#(.*)$/);
  return match ? match[1] : '';
};

History.prototype.getFragment = function (fragment, forcePushState) {
  if (core.isEmpty(fragment)) {
    if (this._hasPushState || !this._wantsHashChange || forcePushState) {
      var root;
      fragment = decodeURI(this.location.pathname + this.location.search);
      root = this.root.replace(_trailingSlash, '');
      if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
    } else {
      fragment = this.getHash();
    }
  }
  return fragment.replace(_routeStripper, '');
};

History.prototype.start = function (options) {
  if (History.started) throw new Error('History has already been started');
  History.started = true;
  
  var fragment = this.getFragment()
    , docMode = document.documentMode
    , oldIE = (_isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

  this.options = core.extend(this.options, { root: '/' }, options);

  this.root = this.options.root;

  this._wantsHashChange = this.options.hashChange !== false;

  this._wantsPushState = !!this.options.pushState;

  this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

  this.root = ('/' + this.root + '/').replace(_rootStripper, '/');

  if (oldIE && this._wantsHashChange) {
    var dummy = document.createElement('div')
      , frame;
    dummy.innerHTML = '<iframe src="javascript:0" tabindex="-1">';
    frame = dummy.firstChild;
    frame.style.display = 'none';
    document.body.appendChild(frame);
    this.iframe = frame.contentWindow;
    this.navigate(fragment);
  }

  if (this._hasPushState) {
    window.addEventListener('popstate', this.checkUrl, false);
  } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
    window.addEventListener('hashchange', this.checkUrl, false);
  } else if (this._wantsHashChange) {
    this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
  }

  this.fragment = fragment;

  var loc = this.location;
  if (this._wantsHashChange && this._wantsPushState) {
    if (!this._hasPushState && !this.atRoot()) {
      this.fragment = this.getFragment(null, true);
      this.location.replace(this.root + '#' + this.fragment);
      return true;
    } else if (this._hasPushState && this.atRoot() && loc.hash) {
      this.fragment = this.getHash().replace(_routeStripper, '');
      this.history.replaceState({}, document.title, this.root + this.fragment);
    }
  }

  if (!this.options.silent) return this.loadUrl();
};

History.prototype.stop = function () {
  window.removeEventListener('popstate', this.checkUrl, false);
  window.removeEventListener('hashchange', this.checkUrl, false);
  if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
  History.started = false;
};

History.prototype.route = function (route, callback) {
  this.handlers.unshift({ route: route, callback: callback });
};

History.prototype.checkUrl = function (e) {
  var current = this.getFragment();
  if (current === this.fragment && this.iframe) {
    current = this.getFragment(this.getHash(this.iframe));
  }
  if (current === this.fragment) return false;
  if (this.iframe) this.navigate(current);
  this.loadUrl();
};

History.prototype.loadUrl = function (fragment) {
  fragment = this.fragment = this.getFragment(fragment);
  return this.handlers.some(function (handler) {
    if (handler.route.test(fragment)) {
      handler.callback(fragment);
      return true;
    }
  });
};

History.prototype.navigate = function (fragment, options) {
  if (!History.started) return false;
  if (!options || options === true) options = { trigger: !!options };

  var url = this.root + (fragment = this.getFragment(fragment || ''));
  fragment = fragment.replace(_pathStripper, '');

  if (this.fragment === fragment) return;

  this.fragment = fragment;

  if (fragment === '' && url !== '/') url = url.slice(0, -1);
  
  if (this._hasPushState) {
    this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
  } else if (this._wantsHashChange) {
    this._updateHash(this.location, fragment, options.replace);
    if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
      if (!options.replace) this.iframe.document.open().close();
      this._updateHash(this.iframe.location, fragment, options.replace);
    }
  } else {
    return this.location.assign(url);
  }
  if (options.trigger) return this.loadUrl(fragment);
};

History.prototype._updateHash = function (location, fragment, replace) {
  if (replace) {
    var href = location.href.replace(/(javascript:|#).*$/, '');
    location.replace(href + '#' + fragment);
  } else {
    location.hash = '#' + fragment;
  }
};

module.exports = new History();
