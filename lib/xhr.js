var Promise = require('es6-promise').Promise;

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest !== 'undefined') {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}

function setHeaders(xhr, headers) {
  var key;
  for (key in headers) {
    if (headers.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }
  return xhr;
}

function XHR(method, url, options) {
  options = options || {};

  var params = null
    , request = createCORSRequest(method, url);

  if (request === null) throw new Error('CORS is not supported in this browser');
  if (options.headers) {
    request = setHeaders(request, options.headers);
  }
  if (options.params) {
    params = JSON.stringify(options.params);
  }

  this.method = method;

  this.params = params;

  this.request = request;

  this.url = url;
}

XHR.prototype.complete = function (func) {
  return function (callback) {
    func().then(function (result) {
      callback(result.error, result.data, result.request);
    })['catch'](function (err) {
      callback({ error: err });
    });
  };
};

XHR.prototype.send = function () {
  if (this.params) {
    return this.request.send(this.params);
  }
  return this.request.send();
};

exports.get = function (url, options) {
  var xhr = new XHR('GET', url);
  xhr.complete = xhr.complete(function () {
    return new Promise(function (resolve, reject) {
      xhr.request.addEventListener('load', function _load() {
        if (xhr.request.status === 200) {
          var data = xhr.request.responseText;
          if (options.json) {
            try {
              data = JSON.parse(data);
            } catch (e) {
              reject({ error: e });
            }
          }
          resolve({
            error: null,
            data: data,
            request: xhr.request
          });
        } else {
          reject({ error: new Error('There was an error making the request') });
        }
      });
      xhr.send();
    });
  });
  return xhr;
};
