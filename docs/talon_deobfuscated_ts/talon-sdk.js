(function () {
    var modules = {
      9669: function (module, exports, require) {
        module.exports = require(1609);
      },
      5448: function (module, exports, require) {
        'use strict';
  
        var utils = require(4867);
        var settle = require(6026);
        var cookies = require(4372);
        var buildURL = require(5327);
        var buildFullPath = require(4097);
        var parseHeaders = require(4109);
        var isURLSameOrigin = require(7985);
        var transitionalDefaults = require(7874);
        var AxiosError = require(2648);
        var CanceledError = require(644);
        var parseProtocol = require(205);
        module.exports = function (config) {
          return new Promise(function (resolve, reject) {
            var requestData;
            var requestHeaders = config.headers;
            var responseType = config.responseType;
            function onRequestComplete() {
              if (config.cancelToken) {
                config.cancelToken.unsubscribe(requestData);
              }
              if (config.signal) {
                config.signal.removeEventListener("abort", requestData);
              }
            }
            if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
              delete requestHeaders["Content-Type"];
            }
            var request = new XMLHttpRequest();
            if (config.auth) {
              var username = config.auth.username || "";
              var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
              requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
            }
            var fullPath = buildFullPath(config.baseURL, config.url);
            function handleResponse() {
              if (request) {
                var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
                var response = {
                  data: responseType && responseType !== "text" && responseType !== "json" ? request.response : request.responseText,
                  status: request.status,
                  statusText: request.statusText,
                  headers: responseHeaders,
                  config: config,
                  request: request
                };
                settle(function (value) {
                  resolve(value);
                  onRequestComplete();
                }, function (error) {
                  reject(error);
                  onRequestComplete();
                }, response);
                request = null;
              }
            }
            request.open(config.method.toUpperCase(), buildFullPath(fullPath, config.params, config.paramsSerializer), true);
            request.timeout = config.timeout;
            if ("onloadend" in request) {
              request.onloadend = handleResponse;
            } else {
              request.onreadystatechange = function () {
                if (request && request.readyState === 4 && (request.status !== 0 || request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                  setTimeout(handleResponse);
                }
              };
            }
            request.onabort = function () {
              if (request) {
                reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
                request = null;
              }
            };
            request.onerror = function () {
              reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request, request));
              request = null;
            };
            request.ontimeout = function () {
              var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
              var transitional = config.transitional || transitionalDefaults;
              if (config.timeoutErrorMessage) {
                timeoutErrorMessage = config.timeoutErrorMessage;
              }
              reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request));
              request = null;
            };
            if (utils.isStandardBrowserEnv()) {
              var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;
              if (xsrfValue) {
                requestHeaders[config.xsrfHeaderName] = xsrfValue;
              }
            }
            if ("setRequestHeader" in request) {
              utils.forEach(requestHeaders, function (val, key) {
                if (requestData === undefined && key.toLowerCase() === "content-type") {
                  delete requestHeaders[key];
                } else {
                  request.setRequestHeader(key, val);
                }
              });
            }
            if (!utils.isUndefined(config.withCredentials)) {
              request.withCredentials = !!config.withCredentials;
            }
            if (responseType && responseType !== "json") {
              request.responseType = config.responseType;
            }
            if (typeof config.onDownloadProgress === "function") {
              request.addEventListener("progress", config.onDownloadProgress);
            }
            if (typeof config.onUploadProgress === "function" && request.upload) {
              request.upload.addEventListener("progress", config.onUploadProgress);
            }
            if (config.cancelToken || config.signal) {
              requestData = function (cancel) {
                if (request) {
                  reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
                  request.abort();
                  request = null;
                }
              };
            function createCancelToken(executor) {
              if (typeof executor !== "function") {
                throw new TypeError("executor must be a function.");
              }

              let resolvePromise;
              this.promise = new Promise((resolve) => {
                resolvePromise = resolve;
              });

              const token = this;

              this.promise.then((reason) => {
                if (token.listeners) {
                  for (let i = 0; i < token.listeners.length; i++) {
                    token.listeners[i](reason);
                  }
                  token.listeners = null;
                }
              });

              this.promise.then = (onFulfilled) => {
                let resolveChained;
                const chainedPromise = new Promise((resolve) => {
                  token.subscribe(resolve);
                  resolveChained = resolve;
                }).then(onFulfilled);

                chainedPromise.cancel = () => {
                  token.unsubscribe(resolveChained);
                };

                return chainedPromise;
              };

              executor((message) => {
                if (!token.reason) {
                  token.reason = new CanceledError(message);
                  resolvePromise(token.reason);
                }
              });
            }

            createCancelToken.prototype.throwIfRequested = function () {
              if (this.reason) {
                throw this.reason;
              }
            };

            createCancelToken.prototype.subscribe = function (listener) {
              if (this.reason) {
                listener(this.reason);
              } else if (this.listeners) {
                this.listeners.push(listener);
              } else {
                this.listeners = [listener];
              }
          class CancelToken {
  constructor(executor) {
      this._listeners = [];
      executor((message) => {
          if (this._listeners) {
              this._listeners.forEach((listener) => listener(message));
              this._listeners = null;
          }
      });
  }

  subscribe(listener) {
      if (this._listeners) {
          this._listeners.push(listener);
      }
  }

  unsubscribe(listener) {
      if (this._listeners) {
          const index = this._listeners.indexOf(listener);
          if (index !== -1) {
              this._listeners.splice(index, 1);
          }
      }
  }

  static source() {
      let cancel;
      return {
          token: new CancelToken((cancelFn) => {
              cancel = cancelFn;
          }),
          cancel: cancel
      };
  }
}

module.exports = CancelToken;

class CanceledError extends Error {
  constructor(message) {
      super(message == null ? "canceled" : message);
      this.name = "CanceledError";
  }
}

Object.assign(CanceledError.prototype, {
  __CANCEL__: true
});

module.exports = CanceledError;

module.exports = function isCancel(value) {
  return !!value && !!value.__CANCEL__;
};

const utils = require('./utils');
const buildURL = require('./helpers/buildURL');
const InterceptorManager = require('./InterceptorManager');
const dispatchRequest = require('./core/dispatchRequest');
const mergeConfig = require('./core/mergeConfig');
const validator = require('./helpers/validator');
const validators = validator.validators;

class Axios {
  constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
          request: new InterceptorManager(),
          response: new InterceptorManager()
      };
  }

  request(configOrUrl, config) {
      if (typeof configOrUrl === 'string') {
          config = config || {};
          config.url = configOrUrl;
      } else {
          config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      if (config.method) {
          config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
          config.method = this.defaults.method.toLowerCase();
      } else {
          config.method = 'get';
      }

      const transitional = config.transitional;

      if (transitional !== undefined) {
          validator.assertOptions(transitional, {
              silentJSONParsing: validators.transitional(validators.boolean),
              forcedJSONParsing: validators.transitional(validators.boolean),
              clarifyTimeoutError: validators.transitional(validators.boolean)
          }, false);
      }
  }
}
var requestInterceptors = [];
var isAllSynchronous = true;

this.interceptors.request.forEach(function (interceptor) {
  if (typeof interceptor.runWhen != "function" || interceptor.runWhen(config) !== false) {
    isAllSynchronous = isAllSynchronous && interceptor.synchronous;
    requestInterceptors.unshift(interceptor.fulfilled, interceptor.rejected);
  }
});

var promise;
var responseInterceptors = [];

this.interceptors.response.forEach(function (interceptor) {
  responseInterceptors.push(interceptor.fulfilled, interceptor.rejected);
});

if (!isAllSynchronous) {
  var chain = [dispatchRequest, undefined];
  Array.prototype.unshift.apply(chain, requestInterceptors);
  chain = chain.concat(responseInterceptors);
  promise = Promise.resolve(config);
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
}

var newConfig = config;
while (requestInterceptors.length) {
  var onFulfilled = requestInterceptors.shift();
  var onRejected = requestInterceptors.shift();
  try {
    newConfig = onFulfilled(newConfig);
  } catch (error) {
    onRejected(error);
    break;
  }
}

try {
  promise = dispatchRequest(newConfig);
} catch (error) {
  return Promise.reject(error);
}

while (responseInterceptors.length) {
  promise = promise.then(responseInterceptors.shift(), responseInterceptors.shift());
}

return promise;
};

Axios.prototype.getUri = function (config) {
  config = mergeConfig(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

['delete', 'get', 'head', 'options'].forEach(function (method) {
  Axios.prototype[method] = function (url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

['post', 'put', 'patch'].forEach(function (method) {
  function generateHTTPMethod(isForm) {
    return function (url, data, config) {
      var requestConfig = {
        method: method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: url,
        data: data
      };
      return this.request(mergeConfig(config || {}, requestConfig));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});

module.exports = Axios;
},

2648: function (module, exports, require) {
'use strict';

var utils = require(4867);

function AxiosError(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = "AxiosError";
  if (code) {
    this.code = code;
  }
  if (config) {
    this.config = config;
  }
  if (request) {
    this.request = request;
  }
  if (response) {
    this.response = response;
  }
}

var prototype = {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
}

var AxiosError = function(message, code, config, request, response) {
  Error.call(this, message);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
};

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
].forEach(function(code) {
  descriptors[code] = { value: code };
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', { value: true });

AxiosError.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils.toFlatObject(error, axiosError, function(obj) {
    return obj !== Error.prototype;
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

module.exports = AxiosError;

function (module, exports, require) {
  'use strict';

  var utils = require(4867);
  var defaults = require(5546);
  module.exports = function (data, headers, config) {
    var context = this || defaults;
    utils.forEach(config, function (fn) {
      data = fn.call(context, data, headers);
    });
    return data;
  };
}

function (module, exports, require) {
  'use strict';

  var utils = require(4867);
  var normalizeHeaderName = require(6016);
  var AxiosError = require(2648);
  var transitional = require(7874);
  var toFormData = require(7675);
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers["Content-Type"])) {
      headers["Content-Type"] = value;
    }
  }

  var adapter;
  var defaults = {
    transitional: transitional,
    adapter: ((typeof XMLHttpRequest !== "undefined" || typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") && (adapter = require(5448)), adapter),
    transformRequest: [function (data, headers) {
      normalizeHeaderName(headers, "Accept");
      normalizeHeaderName(headers, "Content-Type");
      if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
        return data.toString();
      }
      var isObjectPayload;
      var contentType = headers && headers["Content-Type"];
      if ((isObjectPayload = utils.isObject(data)) || contentType === "application/json") {
        setContentTypeIfUnset(headers, "application/json");
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function (data) {
      var transitional = this.transitional || defaults.transitional;
      var silentJSONParsing = transitional && transitional.silentJSONParsing;
      var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === "json";

      if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }

      return data;
    }],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: require(1623)
    },
    validateStatus: function (status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*"
      }
    }
  };

  utils.forEach(["delete", "get", "head"], function (method) {
    defaults.headers[method] = {};
  });

  utils.forEach(["post", "put", "patch"], function (method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  module.exports = defaults;
}

function (module) {
  'use strict';

  module.exports = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
}

function (module) {
  module.exports = {
    version: "0.27.2"
  };
}

function (module) {
  'use strict';

  module.exports = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };
}

function (module, exports, require) {
  'use strict';

  var utils = require(4867);

  function encode(val) {
    return encodeURIComponent(val)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");
  }

  module.exports = function buildURL(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };
}

function (module) {
  'use strict';

  module.exports = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };
}

function (module, exports, require) {
  'use strict';

  var utils = require(4867);

  module.exports = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );
}

function (module) {
  'use strict';

  module.exports = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus,  
    const utils = require('./utils');
    const ignoredHeaders = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];

    module.exports = function parseHeaders(headers) {
      const parsed = {};
      let key;
      let value;
      let valueIndex;

      if (!headers) {
        return parsed;
      }

      utils.forEach(headers.split('\n'), function parseHeader(line) {
        valueIndex = line.indexOf(':');
        key = utils.trim(line.substr(0, valueIndex)).toLowerCase();
        value = utils.trim(line.substr(valueIndex + 1));

        if (key) {
          if (parsed[key] && ignoredHeaders.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([value]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + value : value;
          }
        }
      });

      return parsed;
    };
  };

  module.exports = function extractProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || '';
  };

  module.exports = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  const utils = require('./utils');

  module.exports = function toFormData(obj, formData) {
    formData = formData || new FormData();
    const stack = [];

    function convertValue(value) {
      if (value === null) return '';
      if (utils.isDate(value)) return value.toISOString();
      if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
        return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }

    function build(data, parentKey) {
      if (utils.isPlainObject(data) || utils.isArray(data)) {
        if (stack.indexOf(data) !== -1) {
          throw Error('Circular reference detected in ' + parentKey);
        }
        stack.push(data);
        utils.forEach(data, function each(value, key) {
          if (utils.isUndefined(value)) return;
          const fullKey = parentKey ? parentKey + '.' + key : key;
          const arr = utils.isArray(value);

          if (value && !parentKey && typeof value === 'object') {
            if (utils.endsWith(key, '{}')) {
              value = JSON.stringify(value);
            } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
              arr.forEach(function(el) {
                !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
              });
              return;
            }
          }

          build(value, fullKey);
        });
        stack.pop();
      } else {
        formData.append(parentKey, convertValue(data));
      }
    }

    build(obj);
    return formData;
  };

  const VERSION = require('../env/data').version;
  const AxiosError = require('../core/AxiosError');

  const validators = {};

  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });

  const deprecatedWarnings = {};

  validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }

    return (value, option, opts) => {
      if (validator === false) {
        throw new AxiosError(
          formatMessage(option, ' has been removed' + (version ? ' in ' + version : '')),
          AxiosError.ERR_DEPRECATED
        );
      }

      if (version && !deprecatedWarnings[option]) {
        deprecatedWarnings[option] = true;
        console.warn(
          formatMessage(
            option,
            ' has been deprecated since v' + version + ' and will be removed in the near future'
          )
        );
      }

      return validator ? validator(value, option, opts) : true;
    };
  };

  module.exports = {
    assertOptions: function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
      }
      const keys = Object.keys(options);
      let key;
      for (let i = keys.length; i-- > 0;) {
        key = keys[i];
        const opt = schema[key];
        if (opt) {
          const value = options[key];
          const result = value === undefined || opt(value, key, options);
          if (result !== true) {
            throw new AxiosError('option ' + key + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError('Unknown option ' + key, AxiosError.ERR_BAD_OPTION);
        }
      }
    },

    validators
  };

  const kindOf = (cache => thing => {
      const str = Object.prototype.toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(Object.create(null));

  function kindOfTest(type) {
    type = type.toLowerCase();
    return thing => kindOf(thing) === type;
  }

  function isArray(val) {
    return Array.isArray(val);
  }

  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  const isArrayBuffer = kindOfTest('ArrayBuffer');

  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  function isPlainObject(val) {
    if (kindOf(val) !== 'object') {
      return false;
    }

    const prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }

  const isDate = kindOfTest('Date');
  const isFile = kindOfTest('File');
  const isBlob = kindOfTest('Blob');
  const isFileList = kindOfTest('FileList');

  function isFunction(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
  }

  const isURLSearchParams = kindOfTest('URLSearchParams');

  function forEach(obj, fn) {
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    if (typeof obj !== 'object') {
      obj = [obj];
    }

    if (isArray(obj)) {
      for (let i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  var typedArrayPrototype;
  typedArrayPrototype = typeof Uint8Array !== "undefined" && Object.getPrototypeOf(Uint8Array);

  function isTypedArray(value) {
    return typedArrayPrototype && value instanceof typedArrayPrototype;
  }

  module.exports = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: function(obj) {
      return obj !== null && !isUndefined(obj) && obj.constructor !== null && !isUndefined(obj.constructor) && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    },
    isFormData: function(obj) {
      var formDataStr = "[object FormData]";
      return obj && (typeof FormData === "function" && obj instanceof FormData || Object.prototype.toString.call(obj) === formDataStr || (isFunction(obj.toString) && obj.toString() === formDataStr));
    },
    isArrayBufferView: function(val) {
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        return ArrayBuffer.isView(val);
      } else {
        return val && val.buffer && isArrayBuffer(val.buffer);
      }
    },
    isString: function(val) {
      return typeof val === "string";
    },
    isNumber: function(val) {
      return typeof val === "number";
    },
    isObject: isObject,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: function(val) {
      return isObject(val) && isFunction(val.pipe);
    },
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: function() {
      return (typeof navigator === "undefined" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window !== "undefined" && typeof document !== "undefined";
    },
    forEach: forEach,
    merge: function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    },
    extend: function(a, b, thisArg) {
      forEach(b, function(val, key) {
        a[key] = thisArg && typeof val === "function" ? bind(val, thisArg) : val;
      });
      return a;
    },
    trim: function(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    },
    stripBOM: function(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    },
    inherits: function(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      if (props) {
        Object.assign(constructor.prototype, props);
      }
    },
    toFlatObject: function(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};
      destObj = destObj || {};
      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
      return destObj;
    },
    kindOf: kindOf,
    kindOfTest: kindOfTest,
    endsWith: function(str, searchString, position) {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    },
    toArray: function(thing) {
      if (!thing) {
        return null;
      }
      var length = thing.length;
      if (isUndefined(length)) {
        return null;
      }
      var arr = new Array(length);
      while (length-- > 0) {
        arr[length] = thing[length];
      }
      return arr;
    },
    isTypedArray: isTypedArray,
    isFileList: isFileList
  };
},
1081: function(module) {
  'use strict';

  var TRANSIENT_ERROR_CODES = new Set([
    "ENOTFOUND", "ENETUNREACH", "UNABLE_TO_GET_ISSUER_CERT",
    "UNABLE_TO_GET_CRL", "UNABLE_TO_DECRYPT_CERT_SIGNATURE",
    "UNABLE_TO_DECRYPT_CRL_SIGNATURE", "UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY",
    "CERT_SIGNATURE_FAILURE", "CRL_SIGNATURE_FAILURE", "CERT_NOT_YET_VALID",
    "CERT_HAS_EXPIRED", "CRL_NOT_YET_VALID", "CRL_HAS_EXPIRED",
    "ERROR_IN_CERT_NOT_BEFORE_FIELD", "ERROR_IN_CERT_NOT_AFTER_FIELD",
    "ERROR_IN_CRL_LAST_UPDATE_FIELD", "ERROR_IN_CRL_NEXT_UPDATE_FIELD",
    "OUT_OF_MEM", "DEPTH_ZERO_SELF_SIGNED_CERT", "SELF_SIGNED_CERT_IN_CHAIN",
    "UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "CERT_CHAIN_TOO_LONG", "CERT_REVOKED", "INVALID_CA", "PATH_LENGTH_EXCEEDED",
    "INVALID_PURPOSE", "CERT_UNTRUSTED", "CERT_REJECTED", "HOSTNAME_MISMATCH"
  ]);

  module.exports = function(error) {
    return !TRANSIENT_ERROR_CODES.has(error && error.code);
  };
},
487: function(module) {
  var charsetUtils = {
    utf8: {
      stringToBytes: function(str) {
        return charsetUtils.bin.stringToBytes(unescape(encodeURIComponent(str)));
      },
      bytesToString: function(bytes) {
        return decodeURIComponent(escape(charsetUtils.bin.bytesToString(bytes)));
      }
    },
    bin: {
      stringToBytes: function(str) {
        var bytes = [];
        for (var i = 0; i < str.length; i++) {
          bytes.push(str.charCodeAt(i) & 255);
        }
        return bytes;
      },
      bytesToString: function(bytes) {
        var chars = [];
        for (var i = 0; i < bytes.length; i++) {
          chars.push(String.fromCharCode(bytes[i]));
        }
        return chars.join("");
      }
    }
  };
  module.exports = charsetUtils;
  },
  1012: function (module) {
    var base64Chars;
    var utils;
    base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    utils = {
      rotateLeft: function (number, count) {
        return (number << count) | (number >>> (32 - count));
      },
      rotateRight: function (number, count) {
        return (number << (32 - count)) | (number >>> count);
      },
      endian: function (number) {
        if (number.constructor == Number) {
          return utils.rotateLeft(number, 8) & 0x00FF00FF | utils.rotateLeft(number, 24) & 0xFF00FF00;
        }
        for (var i = 0; i < number.length; i++) {
          number[i] = utils.endian(number[i]);
        }
        return number;
      },
      randomBytes: function (count) {
        var bytes = [];
        for (; count > 0; count--) {
          bytes.push(Math.floor(Math.random() * 256));
        }
        return bytes;
      },
      bytesToWords: function (bytes) {
        var words = [];
        for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
          words[b >>> 5] |= bytes[i] << (24 - b % 32);
        }
        return words;
      },
      wordsToBytes: function (words) {
        var bytes = [];
        for (var b = 0; b < words.length * 32; b += 8) {
          bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        }
        return bytes;
      },
      bytesToHex: function (bytes) {
        var hex = [];
        for (var i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("");
      },
      hexToBytes: function (hex) {
        var bytes = [];
        for (var i = 0; i < hex.length; i += 2) {
          bytes.push(parseInt(hex.substr(i, 2), 16));
        }
        return bytes;
      },
      bytesToBase64: function (bytes) {
        var base64 = [];
        for (var i = 0; i < bytes.length; i += 3) {
          var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
          for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 <= bytes.length * 8) {
              base64.push(base64Chars.charAt((triplet >>> (3 - j) * 6) & 0x3F));
            } else {
              base64.push("=");
            }
          }
        }
        return base64.join("");
      },
      base64ToBytes: function (base64) {
        base64 = base64.replace(/[^A-Z0-9+\/]/gi, "");
        var bytes = [];
        for (var i = 0, b = 0; i < base64.length; b = ++i % 4) {
          if (b != 0) {
            bytes.push((base64Chars.indexOf(base64.charAt(i - 1)) & (Math.pow(2, b * 2 + 2) - 1)) << (b * 2) | base64Chars.indexOf(base64.charAt(i)) >>> (6 - b * 2));
          }
        }
        return bytes;
      }
    };
    module.exports = utils;
  },
  6452: function (module, exports, require) {
    'use strict';

    var cssWithMappingToString = require(8081);
    var cssWithMappingToStringModule = require.n(cssWithMappingToString);
    var cssLoader = require(3645);
    var cssLoaderModule = require.n(cssLoader)()(cssWithMappingToStringModule());
    cssLoaderModule.push([module.id, "@media screen and (max-height: 725px) {\n    .talon_challenge_container h4 {\n        display:none;\n    }\n}\n\n@media screen and (max-height: 800px) {\n    .talon_challenge_container h1 {\n        display:none;\n    }\n}\n\n@media screen and (max-height: 900px) {\n    .talon_logo {\n        display:none;\n    }\n}\n\n.h_captcha_challenge {\n    margin-bottom:25px;\n}\n\n.talon_challenge_container h1 {\n    font-family:sans-serif;\n    font-size:44px;\n    font-weight:400;\n    margin:0;\n}\n\n.talon_challenge_container h4 {\n    color:rgba(255,255,255,0.72);\n    font-family:sans-serif;\n    font-size:14px;\n    font-weight:400;\n    margin:5px;\n    opacity:0.75;\n}\n\n.talon_challenge_container hr {\n    border-bottom:0;\n    max-width:500px;\n    opacity:0.25;\n}\n\n.talon_challenge_container p {\n    color:rgba(255,255,255,0.72);\n    font-family:sans-serif;\n    font-size:10px;\n}\n\n.talon_challenge_container {\n    display:flex;\n    flex-direction:column;\n    font-family:sans-serif;\n    line-height:initial;\n    overflow: scroll;\n    scrollbar-width: none;\n}\n\n.talon_challenge_container::-webkit-scrollbar {\n    width: 0 !important\n}\n\n.talon_close_button {\n    background:rgba(0,0,0,0);\n    border-radius:4px;\n    color:#fff;\n    cursor:pointer;\n    padding:5px;\n    position:absolute;\n    right:15px;\n    top:10px;\n    transition:.1s;\n}\n\n.talon_close_button:hover {\n    background:#3b3b3b;\n}\n\n.talon_error_container button {\n    background:rgba(0,0,0,0);\n    border:1px solid #000;\n    border-radius:4px;\n    color:#000;\n    cursor:pointer;\n    font-family:sans-serif;\n    font-weight:700;\n    margin:5px;\n    padding:14px 22px;\n}\n\n.talon_error_container p {\n    color:#000;\n    font-family:sans-serif;\n    font-size:14px;\n    margin:20px;\n}\n\n.talon_error_container {\n    align-items:flex-start;\n    background:#FFA640;\n    border-radius:4px;\n    display:none;\n    justify-content:space-between;\n    margin:auto auto 8px;\n    text-align:left;\n    width:500px;\n}\n\n.talon_logo {\n    margin:0 auto;\n    width:80px;\n}", ""]);
    exports.Z = cssLoaderModule;
  },
  3645: function (module) {
    'use strict';

    module.exports = function (cssWithMappingToString) {
      var list = [];
      list.toString = function toString() {
        return this.map(function (item) {
          var content = "";
          var needLayer = typeof item[5] !== "undefined";
          if (item[4]) {
            content += "@supports (" + item[4] + ") {";
          }
          if (item[2]) {
            content += "@media " + item[2] + " {";
          }
          if (needLayer) {
            content += "@layer" + (item[5].length > 0 ? " " + item[5] : "") + " {";
          }
          content += cssWithMappingToString(item);
          if (needLayer) {
            content += "}";
          }
          if (item[2]) {
            content += "}";
          }
          if (item[4]) {
            content += "}";
          }
          return content;
        }).join("");
      };

      list.i = function i(modules, media, dedupe, supports, layer) {
        if (typeof modules === "string") {
          modules = [[null, modules, undefined]];
        }
        var alreadyImportedModules = {};
        if (dedupe) {
          for (var k = 0; k < this.length; k++) {
            var id = this[k][0];
            if (id != null) {
              alreadyImportedModules[id] = true;
            }
          }
        }
        for (var _k = 0; _k < modules.length; _k++) {
          var item = [].concat(modules[_k]);
          if (dedupe && alreadyImportedModules[item[0]]) {
            continue;
          }
          if (typeof layer !== "undefined") {
            if (typeof item[5] === "undefined") {
              item[5] = layer;
            } else {
              item[1] = "@layer" + (item[5].length > 0 ? " " + item[5] : "") + " {" + item[1] + "}";
              item[5] = layer;
            }
          }
          if (media) {
            if (!item[2]) {
              item[2] = media;
            } else {
              item[1] = "@media " + item[2] + " {" + item[1] + "}";
              item[2] = media;
            }
          }
          if (supports) {
            if (!item[4]) {
              item[4] = "" + supports;
            } else {
              item[1] = "@supports (" + item[4] + ") {" + item[1] + "}";
              item[4] = supports;
            }
          }
          list.push(item);
        }
      };
      return list;
    };
  },
  8081: function (module) {
    'use strict';
  
    module.exports = function (list) {
      return list[1];
    };
  },
  8738: function (module) {
    function isBuffer(obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
    }
    module.exports = function (obj) {
      return obj != null && (isBuffer(obj) || function (obj) {
        return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
      }(obj) || !!obj._isBuffer);
    };
  },
  2568: function (module, exports, require) {
    var utils;
    var utf8;
    var isBuffer;
    var bin;
    var md5;
    utils = require(1012);
    utf8 = require(487).utf8;
    isBuffer = require(8738);
    bin = require(487).bin;
    (md5 = function (message, options) {
      if (message.constructor == String) {
        message = options && options.encoding === "binary" ? bin.stringToBytes(message) : utf8.stringToBytes(message);
      } else if (isBuffer(message)) {
        message = Array.prototype.slice.call(message, 0);
      } else if (!Array.isArray(message) && message.constructor !== Uint8Array) {
        message = message.toString();
      }
      var m = utils.bytesToWords(message);
      var l = message.length * 8;
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;
      for (var i = 0; i < m.length; i++) {
        m[i] = ((m[i] << 8) | (m[i] >>> 24)) & 0x00FF00FF | ((m[i] << 24) | (m[i] >>> 8)) & 0xFF00FF00;
      }
      m[l >>> 5] |= 0x80 << (l % 32);
      m[14 + ((l + 64) >>> 9 << 4)] = l;
      var FF = md5._ff;
      var GG = md5._gg;
      var HH = md5._hh;
      var II = md5._ii;
      for (var i = 0; i < m.length; i += 16) {
        var aa = a;
        var bb = b;
        var cc = c;
        var dd = d;
        a = FF(a, b, c, d, m[i + 0], 7, -680876936);
        d = FF(d, a, b, c, m[i + 1], 12, -389564586);
        c = FF(c, d, a, b, m[i + 2], 17, 606105819);
        b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
        // ... (rest of the MD5 algorithm)
        a = (a + aa) >>> 0;
        b = (b + bb) >>> 0;
        c = (c + cc) >>> 0;
        d = (d + dd) >>> 0;
      }
      return utils.endian([a, b, c, d]);
    })._ff = function (a, b, c, d, x, s, t) {
      var n = a + ((b & c) | (~b & d)) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._gg = function (a, b, c, d, x, s, t) {
      var n = a + ((b & d) | (c & ~d)) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._hh = function (a, b, c, d, x, s, t) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._ii = function (a, b, c, d, x, s, t) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._blocksize = 16;
    md5._digestsize = 16;
    module.exports = function (message, options) {
      if (message == null) {
        throw new Error("Illegal argument " + message);
      }
      var digest = utils.wordsToBytes(md5(message, options));
      return options && options.asBytes ? digest
           : options && options.asString ? bin.bytesToString(digest)
           : utils.bytesToHex(digest);
    };
  },
  3379: function (module) {
    'use strict';

    var stylesInDOM = [];

    function getIndexByIdentifier(identifier) {
      var result = -1;
      for (var i = 0; i < stylesInDOM.length; i++) {
        if (stylesInDOM[i].identifier === identifier) {
          result = i;
          break;
        }
      }
      return result;
    }

    function modulesToDom(list, options) {
      var idCountMap = {};
      var identifiers = [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var id = options.base ? item[0] + options.base : item[0];
        var count = idCountMap[id] || 0;
        var identifier = id + ' ' + count;
        idCountMap[id] = count + 1;
        var indexByIdentifier = getIndexByIdentifier(identifier);
        var obj = {
          css: item[1],
          media: item[2],
          sourceMap: item[3],
          supports: item[4],
          layer: item[5]
        };
        if (indexByIdentifier !== -1) {
          stylesInDOM[indexByIdentifier].references++;
          stylesInDOM[indexByIdentifier].updater(obj);
        } else {
          var updater = addElementStyle(obj, options);
          options.byIndex = i;
          stylesInDOM.splice(i, 0, {
            identifier: identifier,
            updater: updater,
            references: 1
          });
        }
        identifiers.push(identifier);
      }
      return identifiers;
    }

    function addElementStyle(obj, options) {
      var api = options.domAPI(options);
      api.update(obj);
      return function updateStyle(newObj) {
        if (newObj) {
          if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
            return;
          }
          api.update(obj = newObj);
        } else {
          api.remove();
        }
      };
    }

    module.exports = function (list, options) {
      options = options || {};
      var update = modulesToDom(list, options);
      return function updateList(newList) {
        newList = newList || [];
        for (var i = 0; i < update.length; i++) {
          var item = update[i];
          var index = getIndexByIdentifier(item);
          stylesInDOM[index].references--;
        }
        var newUpdate = modulesToDom(newList, options);
        for (var i = 0; i < update.length; i++) {
          var item = update[i];
          var index = getIndexByIdentifier(item);
          if (stylesInDOM[index].references === 0) {
            stylesInDOM[index].updater();
            stylesInDOM.splice(index, 1);
          }
        }
        update = newUpdate;
      };
    };
  },
  569: function (module) {
    'use strict';

    var memo = {};
    module.exports = function (target, insert) {
      var styleTarget = function (target) {
        if (memo[target] === undefined) {
          var styleTarget = document.querySelector(target);
          if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
            try {
              styleTarget = styleTarget.contentDocument.head;
            } catch (e) {
              styleTarget = null;
            }
          }
          memo[target] = styleTarget;
        }
        return memo[target];
      }(target);
      if (!styleTarget) {
        throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
      }
      styleTarget.appendChild(insert);
    };
  },
  9216: function (module) {
    'use strict';

    module.exports = function (options) {
      var element = document.createElement("style");
      options.setAttributes(element, options.attributes);
      options.insert(element, options.options);
      return element;
    };
  },
  3565: function (module, exports, require) {
    'use strict';

    module.exports = function (element) {
      var nonce = require.nc;
      if (nonce) {
        element.setAttribute("nonce", nonce);
      }
    };
  },
  7795: function (module) {
    'use strict';

    module.exports = function (options) {
      var element = options.insertStyleElement(options);
      return {
        update: function (obj) {
          (function (element, options, obj) {
            var css = "";
            if (obj.supports) {
              css += "@supports (" + obj.supports + ") {";
            }
            if (obj.media) {
              css += "@media " + obj.media + " {";
            }
            var needLayer = typeof obj.layer !== "undefined";
            if (needLayer) {
              css += "@layer" + (obj.layer.length > 0 ? " " + obj.layer : "") + " {";
            }
            css += obj.css;
            if (needLayer) {
              css += "}";
            }
            if (obj.media) {
              css += "}";
            }
            if (obj.supports) {
              css += "}";
            }
            var sourceMap = obj.sourceMap;
            if (sourceMap && typeof btoa !== "undefined") {
              css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
            }
            options.styleTagTransform(css, element, options.options);
          })(element, options, obj);
        },
        remove: function () {
          (function (element) {
            if (element.parentNode === null) {
              return false;
            }
            element.parentNode.removeChild(element);
          })(element);
        }
      };
    };
  },
  4589: function (module) {
    'use strict';

    module.exports = function (cssText, styleElement) {
      if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = cssText;
      } else {
        while (styleElement.firstChild) {
          styleElement.removeChild(styleElement.firstChild);
        }
        styleElement.appendChild(document.createTextNode(cssText));
      }
    };
  },
  6222: function (module, exports, require) {
    var Digest = require(8439);
    var TripletHashGenerator = require(9640);
    var Quartiles = require(2196);

    module.exports = function (input) {
      var checksum;
      var inputLength = input ? input.length : 0;
      var frequencyArray = Array.apply(null, Array(256)).map(Number.prototype.valueOf, 0);
      var tripletHashGen = new TripletHashGenerator();

      function incrementFrequency(charCode) {
        if (frequencyArray[charCode]) {
          frequencyArray[charCode]++;
        } else {
          frequencyArray[charCode] = 1;
        }
      }

      for (var i = 0; i < inputLength; i++) {
        var charCode = input.charCodeAt(i);
        var pivot = tripletHashGen.getPivot();
        tripletHashGen.put(charCode);
        checksum = tripletHashGen.getChecksum(pivot, checksum);
        tripletHashGen.getTripletHashes(pivot).forEach(incrementFrequency);
      }

      return function (length, frequencyArray, checksum) {
        var quartiles = new Quartiles(frequencyArray);
        return new Digest(checksum, length, frequencyArray, quartiles);
      }(inputLength, frequencyArray, checksum);
    };
  },
  7172: function (module, exports, require) {
    var Body = require(219);
    var Checksum = require(2095);
    var Digest = require(641);
    var LengthValue = require(6357);
    var Quartiles = require(6828);

    module.exports = function () {
      return {
        withChecksum: function (checksumValue) {
          this.checksum = new Checksum(checksumValue);
          return this;
        },
        withLength: function (length) {
          this.lValue = new LengthValue(function (value) {
            if (value <= 656) {
              return Math.floor(Math.log(value) / 0.4054651) % 256;
            } else if (value <= 3199) {
              return Math.floor(Math.log(value) / 0.26236426 - 8.72777) % 256;
            } else {
              return Math.floor(Math.log(value) / 0.09531018 - 62.5472) % 256;
            }
          }(length));
          return this;
        },
        withQuartiles: function (quartilesData) {
          this.q = new function (q1Ratio, q2Ratio) {
            return new Quartiles(function (a, b) {
              return (a & 15 | 0) & 15 | (b & 15) << 4;
            }(q1Ratio, q2Ratio));
          }(quartilesData.getQ1Ratio(), quartilesData.getQ2Ratio());
          return this;
        },
        withBody: function (bodyData) {
          this.body = new Body(bodyData);
          return this;
        },
        build: function () {
          return new Digest(this.checksum, this.lValue, this.q, this.body);
        }
      };
    };
  },
  2056: function (module) {
    var sBox;
    sBox = [1, 87, 49, 12, 176, 178, 102, 166, 121, 193, 6, 84, 249, 230, 44, 163, 14, 197, 213, 181, 161, 85, 218, 80, 64, 239, 24, 226, 236, 142, 38, 200, 110, 177, 104, 103, 141, 253, 255, 50, 77, 101, 81, 18, 45, 96, 31, 222, 25, 107, 190, 70, 86, 237, 240, 34, 72, 242, 20, 214, 244, 227, 149, 235, 97, 234, 57, 22, 60, 250, 82, 175, 208, 5, 127, 199, 111, 62, 135, 248, 174, 169, 211, 58, 66, 154, 106, 195, 245, 171, 17, 187, 182, 179, 0, 243, 132, 56, 148, 75, 128, 133, 158, 100, 130, 126, 91, 13, 153, 246, 216, 219, 119, 68, 223, 78, 83, 88, 201, 99, 122, 11, 92, 32, 136, 114, 52, 10, 138, 30, 48, 183, 156, 35, 61, 26, 143, 74, 251, 94, 129, 162, 63, 152, 170, 7, 115, 167, 241, 206, 3, 150, 55, 59, 151, 220, 90, 53, 23, 131, 125, 173, 15, 238, 79, 95, 89, 16, 105, 137, 225, 224, 217, 160, 37, 123, 118, 73, 2, 157, 46, 116, 9, 145, 134, 228, 207, 212, 202, 215, 69, 229, 27, 188, 67, 124, 168, 252, 42, 4, 29, 108, 21, 247, 19, 205, 39, 203, 233, 40, 186, 147, 198, 192, 155, 33, 164, 191, 98, 204, 165, 180, 117, 76, 140, 36, 210, 172, 41, 54, 159, 8, 185, 232, 113, 196, 231, 47, 146, 120, 51, 65, 28, 144, 254, 221, 93, 189, 194, 139, 112, 43, 71, 109, 184, 209];

    function calculateChecksum(data) {
      var checksum = 0;
      data.forEach(function (value) {
        checksum = sBox[checksum ^ value];
      });
      return checksum;
    }

    module.exports = calculateChecksum;
  },
  8439: function (module, exports, require) {
    var DigestBuilder = require(7172);

    module.exports = function (checksum, frequencyArray, length, quartiles) {
      this.isProcessedDataTooSimple = function () {
        return !(length >= 512) || !function () {
          var nonZeroCount = 0;
          for (var i = 0; i < 128; i++) {
            if (frequencyArray[i] > 0) {
              nonZeroCount++;
            }
          }
          return nonZeroCount > 64;
        }();
      };

      this.buildDigest = function () {
        return new DigestBuilder()
          .withChecksum(checksum)
          .withLength(length)
          .withQuartiles(quartiles)
          .withBody(function () {
            var bodyData = new Array(32);
            for (var i = 0; i < 32; i++) {
              var value = 0;
              for (var j = 0; j < 4; j++) {
                var frequency = frequencyArray[i * 4 + j];
                if (quartiles.getThird() < frequency) {
                  value += 3 << j * 2;
                } else if (quartiles.getSecond() < frequency) {
                  value += 2 << j * 2;
                } else if (quartiles.getFirst() < frequency) {
                  value += 1 << j * 2;
                }
              }
              bodyData[i] = value;
            }
            return bodyData;
          }())
          .build();
      };
    };
  },
  function (module) {
    module.exports = function (frequencyArray) {
      const ARRAY_SIZE = 128;

      if (frequencyArray.length < ARRAY_SIZE) {
        throw new Error("Frequency array is too small");
      }

      const sortedArray = frequencyArray.slice(0, ARRAY_SIZE).sort((a, b) => a - b);

      this.getQ1Ratio = function () {
        return Math.floor(this.getFirst() * 100 / this.getThird()) % 16;
      };

      this.getQ2Ratio = function () {
        return Math.floor(this.getSecond() * 100 / this.getThird()) % 16;
      };

      this.getFirst = function () {
        return sortedArray[ARRAY_SIZE / 4 - 1];
      };

      this.getSecond = function () {
        return sortedArray[ARRAY_SIZE / 2 - 1];
      };

      this.getThird = function () {
        return sortedArray[ARRAY_SIZE - ARRAY_SIZE / 4 - 1];
      };
    };
  },

  function (module, exports, require) {
    const HashGenerator = require(1990);

    module.exports = function () {
      const buffer = new Array(5);
      let bufferIndex = 0;

      function getBufferValue(index) {
        return buffer[index];
      }

      function generateHash(a, b, c, salt) {
        return new HashGenerator(a, b, c, salt).getHash();
      }

      function isBufferFull() {
        return bufferIndex >= 5;
      }

      this.put = function (value) {
        buffer[this.getPivot()] = value & 255;
        bufferIndex++;
      };

      this.getPivot = function () {
        return bufferIndex % 5;
      };

      this.getTripletHashes = function (startIndex) {
        if (!isBufferFull()) {
          return [];
        }

        const i1 = startIndex;
        const i2 = (startIndex + 1) % 5;
        const i3 = (startIndex + 2) % 5;
        const i4 = (startIndex + 3) % 5;
        const i5 = (startIndex + 4) % 5;

        return [
          generateHash(buffer[i1], buffer[i5], buffer[i4], 2),
          generateHash(buffer[i1], buffer[i5], buffer[i3], 3),
          generateHash(buffer[i1], buffer[i4], buffer[i3], 5),
          generateHash(buffer[i1], buffer[i4], buffer[i2], 7),
          generateHash(buffer[i1], buffer[i5], buffer[i2], 11),
          generateHash(buffer[i1], buffer[i3], buffer[i2], 13)
        ];
      };

      this.getChecksum = function (startIndex, previousChecksum) {
        if (!isBufferFull()) {
          return null;
        }

        const endIndex = (startIndex + 4) % 5;
        const checksum = new Array(1);

        for (let i = 0; i < 1; i++) {
          const value1 = getBufferValue(startIndex);
          const value2 = getBufferValue(endIndex);
          let prevValue = 0;
          let prevChecksum = 0;

          if (previousChecksum) {
            prevValue = previousChecksum[i];
          }

          if (i !== 0) {
            prevChecksum = checksum[i - 1];
          }

          checksum[i] = generateHash(value1, value2, prevValue, prevChecksum);
        }

        return checksum;
      };
    };
  },

  function (module, exports, require) {
    const generateHash = require(2056);

    function HashGenerator(value1, value2, value3, salt) {
      this.value1 = value1;
      this.value2 = value2;
      this.value3 = value3;
      this.salt = salt;
    }

    HashGenerator.prototype.getHash = function () {
      return generateHash([this.salt, this.value1, this.value2, this.value3]);
    };

    module.exports = HashGenerator;
  },

  function (module) {
    const GRID_SIZE = 256;
    const distanceGrid = initializeDistanceGrid();

    function initializeDistanceGrid() {
      const grid = new Array(GRID_SIZE);

      for (let i = 0; i < GRID_SIZE; i++) {
        grid[i] = new Array(GRID_SIZE);

        for (let j = 0; j < GRID_SIZE; j++) {
          let x = i;
          let y = j;
          let distance = 0;

          for (let k = 0; k < 4; k++) {
            const diff = Math.abs(x % 4 - y % 4);
            distance += diff === 3 ? diff * 2 : diff;

            if (k < 3) {
              x = Math.floor(x / 4);
              y = Math.floor(y / 4);
            }
          }

          grid[i][j] = distance;
        }
      }

      return grid;
    }

    function calculateDistance(x, y) {
      return distanceGrid[x][y];
    }

    module.exports = calculateDistance;
  },

  function (module, exports, require) {
    const calculateDistance = require(6109);

    module.exports = function (values) {
      this.calculateDifference = function (other) {
        return function (otherValues) {
          let totalDifference = 0;

          for (let i = 0; i < values.length; i++) {
            totalDifference += calculateDistance(values[i], otherValues.getValue(i));
          }

          return totalDifference;
        }(other);
      };

      this.getValue = function (index) {
        return values[index];
      };
    };
  },

  function (module) {
    module.exports = function (value) {
      return ((value & 240) >> 4 & 15) | ((value & 15) << 4 & 240);
    };
  },

  function (module) {
    module.exports = function (values) {
      this.calculateDifference = function (other) {
        if (areArraysEqual(values, other.getValue())) {
          return 0;
        } else {
          return 1;
        }
      };

      this.getValue = function () {
        return values;
      };

      function areArraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
          return false;
        }

        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            return false;
          }
        }

        return true;
      }
    };
  },

  function (module, exports, require) {
    const swapNibbles = require(344);

    module.exports = function (data) {
      function toHexString(arr) {
        let hexString = "";

        for (let i = 0; i < arr.length; i++) {
          if (arr[i] < 16) {
            hexString += "0";
          }
          hexString += arr[i].toString(16).toUpperCase();
        }

        return hexString;
      }

      function processChecksum(checksum) {
        const processedChecksum = new Array(1);
        for (let k = 0; k < 1; k++) {
          processedChecksum[k] = swapNibbles(checksum.getValue()[k]);
        }
        return toHexString(processedChecksum);
      }

      function processLValue(lValue) {
        return toHexString([swapNibbles(lValue.getValue())]);
      }

      function processQ(q) {
        return toHexString([swapNibbles(q.getValue())]);
      }

      function processBody(body) {
        const processedBody = new Array(32);
        for (let i = 0; i < 32; i++) {
          processedBody[i] = body.getValue(31 - i);
        }
        return toHexString(processedBody);
      }

      let result = "";
      result += processChecksum(data.getChecksum());
      result += processLValue(data.getLValue());
      result += processQ(data.getQ());
      result += processBody(data.getBody());

      return result;
    };
  },

  function (module, exports, require) {
    const toString = require(5111);

    module.exports = function (checksum, lValue, q, body) {
      this.getLValue = function () {
        return lValue;
      };

      this.getQ = function () {
        return q;
      };

      this.getChecksum = function () {
        return checksum;
      };

      this.getBody = function () {
        return body;
      };

      this.calculateDifference = function (other, includeLValue) {
        let totalDifference = 0;

        if (includeLValue) {
          totalDifference += lValue.calculateDifference(other.getLValue());
        }

        totalDifference += q.calculateDifference(other.getQ());
        totalDifference += checksum.calculateDifference(other.getChecksum());
        totalDifference += body.calculateDifference(other.getBody());

        return totalDifference;
      };

      this.toString = function () {
        return toString(this);
      };
    };
  },

  function (module, exports, require) {
    const calculateCircularDifference = require(2945);

    module.exports = function (value) {
      this.calculateDifference = function (otherValue) {
        const difference = calculateCircularDifference(value, otherValue.getValue(), 256);
        if (difference === 0) {
          return 0;
        } else if (difference === 1) {
          return 1;
        } else {
          return difference * 12;
        }
      };

      this.getValue = function () {
        return value;
      };
    };
  },

  function (module) {
    module.exports = function (value1, value2, range) {
      const absoluteDifference = Math.abs(value2 - value1);
      const circularDifference = range - absoluteDifference;
      return Math.min(absoluteDifference, circularDifference);
    };
  },

  function (module, exports, require) {
    const calculateCircularDifference = require(2945);

    module.exports = function (value) {
      this.getQLo = function () {
        return value & 15;
      };

      this.getQHi = function () {
        return (value & 240) >> 4;
      };

      this.calculateDifference = function (otherValue) {
        let totalDifference = 0;
        const qLoDifference = calculateCircularDifference(this.getQLo(), otherValue.getQLo(), 16);
        totalDifference += qLoDifference <= 1 ? qLoDifference : (qLoDifference - 1) * 12;
        const qHiDifference = calculateCircularDifference(this.getQHi(), otherValue.getQHi(), 16);
        return totalDifference + (qHiDifference <= 1 ? qHiDifference : (qHiDifference - 1) * 12);
      };

      this.getValue = function () {
        return value;
      };
    };
  },

  function (module) {
    function InsufficientComplexityError(message) {
      this.name = "InsufficientComplexityError";
      this.message = message;
      this.stack = new Error().stack;
    }
    InsufficientComplexityError.prototype = Object.create(Error.prototype);
    InsufficientComplexityError.prototype.constructor = InsufficientComplexityError;
    module.exports = InsufficientComplexityError;
  },

  function (module, exports, require) {
    const processData = require(6222);
    const InsufficientComplexityError = require(8383);

    module.exports = function (inputData) {
      const processedData = processData(inputData);
      if (processedData.isProcessedDataTooSimple()) {
        throw new InsufficientComplexityError("Input data hasn't enough complexity");
      }
      return processedData.buildDigest().toString();
    };
  },

  function (module, exports, require) {
    const _interopRequireDefault = require(8698).default;

    function regeneratorRuntime() {
      'use strict';

      module.exports = regeneratorRuntime = function () {
        return exports;
      };
      module.exports.__esModule = true;
      module.exports.default = module.exports;

      var exports = {};
      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      };
      var undefined;
      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }

      try {
        define({}, "");
      } catch (err) {
        define = function (obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);

        defineProperty(generator, "_invoke", {
          value: makeInvokeMethod(innerFn, self, context)
        });

        return generator;
      }

      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }

      // ... (rest of the regeneratorRuntime function)

      exports.wrap = wrap;

      const ContinueSentinel = {};

      function Generator() {}
      function GeneratorFunction() {}
      function GeneratorFunctionPrototype() {}

      const IteratorPrototype = {};
      define(IteratorPrototype, iteratorSymbol, function () {
        return this;
      });

      const getProto = Object.getPrototypeOf;
      const NativeIteratorPrototype = getProto && getProto(getProto(values([])));
      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        IteratorPrototype = NativeIteratorPrototype;
      }

      const Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg);
          });
        });
      }

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          const record = tryCatch(generator[method], generator, arg);
          if (record.type !== "throw") {
            const result = record.arg;
            const value = result.value;
            if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function (value) {
                invoke("next", value, resolve, reject);
              }, function (err) {
                invoke("throw", err, resolve, reject);
              });
            } else {
              return PromiseImpl.resolve(value).then(function (unwrapped) {
                result.value = unwrapped;
                resolve(result);
              }, function (error) {
                return invoke("throw", error, resolve, reject);
              });
            }
          }
          reject(record.arg);
        }

        let previousPromise;
        this._invoke = function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        };
      }

      function maybeInvokeDelegate(delegate, context) {
        const method = delegate.iterator[context.method];
        if (method === undefined) {
          context.delegate = null;
          if (context.method === "throw") {
            if (delegate.iterator.return) {
              context.method = "return";
              context.arg = undefined;
              maybeInvokeDelegate(delegate, context);
              if (context.method === "throw") {
                return ContinueSentinel;
              }
            }
            context.method = "throw";
            context.arg = new TypeError("The iterator does not provide a 'throw' method");
          }
          return ContinueSentinel;
        }

        const record = tryCatch(method, delegate.iterator, context.arg);
        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        const info = record.arg;
        if (info) {
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
            if (context.method !== "return") {
              context.method = "next";
              context.arg = undefined;
            }
            context.delegate = null;
            return ContinueSentinel;
          } else {
            return info;
          }
        } else {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }
      }

      function pushTryEntry(locs) {
        const entry = { tryLoc: locs[0] };
        if (1 in locs) {
          entry.catchLoc = locs[1];
        }
        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }
        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        const record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      function values(iterable) {
        if (iterable) {
          const iteratorMethod = iterable[iteratorSymbol];
          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }
          if (typeof iterable.next === "function") {
            return iterable;
          }
          if (!isNaN(iterable.length)) {
            let i = -1;
            function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }
              next.value = undefined;
              next.done = true;
              return next;
            }
            return next.next = next;
          }
        }
        return { next: doneResult };
      }

      function doneResult() {
        return { value: undefined, done: true };
      }

      GeneratorFunction.prototype = GeneratorFunctionPrototype;
      define(Gp, "constructor", GeneratorFunctionPrototype);
      define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
      GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");

      exports.isGeneratorFunction = function (genFun) {
        const ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
      };

      exports.awrap = function (arg) {
        return { __await: arg };
      };

      defineIteratorMethods(AsyncIterator.prototype);
      define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
        return this;
      });
      exports.AsyncIterator = AsyncIterator;

      exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl = Promise) {
        const iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        if (exports.isGeneratorFunction(outerFn)) {
          return iter;
        } else {
          return iter.next().then(function (result) {
            return result.done ? result.value : iter.next();
          });
        }
      };

      defineProperty(Generator);
      defineProperty(Generator, generatorSymbol, "Generator");
      defineProperty(Generator, iteratorSymbol, function () {
        return this;
      });
      defineProperty(Generator, "toString", function () {
        return "[object Generator]";
      });

      exports.keys = function (object) {
        const keys = [];
        for (let key in object) {
          keys.push(key);
        }
        keys.reverse();
        return function next() {
          while (keys.length) {
            const key = keys.pop();
            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          }
          next.done = true;
          return next;
        };
      };

      exports.values = values;

      Context.prototype = {
        constructor: Context,
        reset: function (skipTempReset) {
          this.prev = 0;
          this.next = 0;
          this.sent = this._sent = undefined;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined;
          this.tryEntries.forEach(resetTryEntry);
          if (!skipTempReset) {
            for (let name in this) {
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined;
              }
            }
          }
        },
        stop: function () {
          this.done = true;
          const rootEntry = this.tryEntries[0];
          const rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }
          return this.rval;
        },
        dispatchException: function (exception) {
          if (this.done) {
            throw exception;
          }
          const context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;
            if (caught) {
              context.method = "next";
              context.arg = undefined;
            }
            return !!caught;
          }
          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];
            const record = entry.completion;
            if (entry.tryLoc === "root") {
              return handle("end");
            }
            if (entry.tryLoc <= this.prev) {
              const hasCatch = hasOwn.call(entry, "catchLoc");
              const hasFinally = hasOwn.call(entry, "finallyLoc");
              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function (type, arg) {
          for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }
          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            finallyEntry = null;
          }
          const record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;
          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }
          return this.complete(record);
        },
        complete: function (result, afterLoc) {
          if (result.type === "throw") {
            throw result.arg;
          }
          if (result.type === "break" || result.type === "continue") {
            this.next = result.arg;
          } else if (result.type === "return") {
            this.rval = this.arg = result.arg;
            this.method = "return";
            this.next = "end";
          } else if (result.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }
          return ContinueSentinel;
        },
        finish: function (finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        catch: function (tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
              var result = entry.completion;
              if (result.type === "throw") {
                var thrownValue = result.arg;
                resetTryEntry(entry);
              }
              return thrownValue;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };
          if (this.method === "next") {
            this.arg = undefined;
          }
          return ContinueSentinel;
        }
      };
      return GeneratorFunction;
    }
    module.exports = defineGenerator;
    module.exports.__esModule = true;
    module.exports.default = module.exports;
  },
  8698: function (module) {
    function _typeof(obj) {
      module.exports = _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        if (obj && typeof Symbol == "function" && obj.constructor === Symbol && obj !== Symbol.prototype) {
          return "symbol";
        } else {
          return typeof obj;
        }
      };
      module.exports.__esModule = true;
      module.exports.default = module.exports;
      return _typeof(obj);
    }
    module.exports = _typeof;
    module.exports.__esModule = true;
    module.exports.default = module.exports;
  },
  4687: function (module, exports, require) {
    var runtime = require(7061)();
    module.exports = runtime;
    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      if (typeof globalThis == "object") {
        globalThis.regeneratorRuntime = runtime;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    }
  }
};
var cache = {};
function __webpack_require__(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = cache[moduleId] = {
    id: moduleId,
    exports: {}
  };
  modules[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}
__webpack_require__.n = function (module) {
  var getter = module && module.__esModule ? function () {
    return module.default;
  } : function () {
    return module;
  };
  __webpack_require__.d(getter, {
    a: getter
  });
  return getter;
};
__webpack_require__.d = function (exports, definition) {
  for (var key in definition) {
    if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      });
    }
  }
};
__webpack_require__.o = function (obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
__webpack_require__.nc = undefined;
(function () {
  'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this;
      var args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var regeneratorRuntime = __webpack_require__(4687);
  var _regeneratorRuntime = __webpack_require__.n(regeneratorRuntime);
  var axios = __webpack_require__(9669);
  var _axios = __webpack_require__.n(axios);
  function _typeof(obj) {
    _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      if (obj && typeof Symbol == "function" && obj.constructor === Symbol && obj !== Symbol.prototype) {
        return "symbol";
      } else {
        return typeof obj;
      }
    };
    return _typeof(obj);
  }
  var isNetworkError = __webpack_require__(1081);
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this;
      var args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    var desc = {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    };
    if (key in obj) {
      Object.defineProperty(obj, key, desc);
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var namespace = "axios-retry";
  function isNetworkOrIdempotentRequestError(error) {
    return !error.response && Boolean(error.code) && error.code !== "ECONNABORTED" && isNetworkError(error);
  }
  var idempotentRequestMethods = ["get", "head", "options"];
  var httpMethodsToRetry = idempotentRequestMethods.concat(["put", "delete"]);
  function isRetryableError(error) {
    return error.code !== "ECONNABORTED" && (!error.response || (error.response.status >= 500 && error.response.status <= 599));
  }
  function isIdempotentRequestError(error) {
    return !!error.config && isRetryableError(error) && httpMethodsToRetry.indexOf(error.config.method) !== -1;
  }
  function shouldRetry(error) {
    return isNetworkOrIdempotentRequestError(error) || isIdempotentRequestError(error);
  }

  function getZeroDelay() {
    return 0;
  }

  function getExponentialDelay(retryCount = 0) {
    const baseDelay = Math.pow(2, retryCount) * 100;
    const jitter = baseDelay * 0.2 * Math.random();
    return baseDelay + jitter;
  }

  function getRetryState(config) {
    const state = config[namespace] || {};
    state.retryCount = state.retryCount || 0;
    config[namespace] = state;
    return state;
  }

  function mergeConfig(axiosConfig, defaultConfig) {
    return Object.assign({}, defaultConfig, axiosConfig[namespace]);
  }

  function removeDefaultAgents(axiosInstance, config) {
    if (axiosInstance.defaults.agent === config.agent) {
      delete config.agent;
    }
    if (axiosInstance.defaults.httpAgent === config.httpAgent) {
      delete config.httpAgent;
    }
    if (axiosInstance.defaults.httpsAgent === config.httpsAgent) {
      delete config.httpsAgent;
    }
  }

  async function shouldRetryRequest(maxRetries, retryCondition, retryState, error) {
    const shouldRetry = retryState.retryCount < maxRetries && retryCondition(error);
  
    if (typeof shouldRetry === "object") {
      try {
        const result = await shouldRetry;
        return result !== false;
      } catch (error) {
        return false;
      }
    }
  
    return shouldRetry;
  }

  function setupAxiosRetry(axiosInstance, defaultOptions) {
    axiosInstance.interceptors.request.use((config) => {
      getRetryState(config).lastRequestTime = Date.now();
      return config;
    });

    axiosInstance.interceptors.response.use(null, async function(error) {
      const { config } = error;
      if (!config) {
        return Promise.reject(error);
      }

      const {
        retries = 3,
        retryCondition = isNetworkOrIdempotentRequestError,
        retryDelay = getZeroDelay,
        shouldResetTimeout = false,
        onRetry = () => {}
      } = mergeConfig(config, defaultOptions);

      const retryState = getRetryState(config);

      if (await shouldRetryRequest(retries, retryCondition, retryState, error)) {
        retryState.retryCount += 1;
        const delay = retryDelay(retryState.retryCount, error);

        removeDefaultAgents(axiosInstance, config);

        if (!shouldResetTimeout && config.timeout && retryState.lastRequestTime) {
          const timeElapsed = Date.now() - retryState.lastRequestTime;
          config.timeout = Math.max(config.timeout - timeElapsed - delay, 1);
        }

        config.transformRequest = [data => data];

        onRetry(retryState.retryCount, error, config);

        return new Promise((resolve) => {
          setTimeout(() => resolve(axiosInstance(config)), delay);
        });
      }

      return Promise.reject(error);
    });
  }

  function getEnvironment(env) {
    return env || "prod";
  }

  setupAxiosRetry.isNetworkError = isNetworkError;
  setupAxiosRetry.isSafeRequestError = function(error) {
    return !!error.config && isRetryableError(error) && idempotentRequestMethods.indexOf(error.config.method) !== -1;
  };
  setupAxiosRetry.isIdempotentRequestError = isIdempotentRequestError;
  setupAxiosRetry.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
  setupAxiosRetry.exponentialDelay = getExponentialDelay;
  setupAxiosRetry.isRetryableError = isRetryableError;

  const environmentUrls = {
    dev: "http://epicgames-local.ol.epicgames.net:12080",
    ci: "https://talon-service-ci.ecac.dev.use1a.on.epicgames.com",
    gamedev: "https://talon-service-gamedev.ecac.dev.use1a.on.epicgames.com",
    prod: "https://talon-service-prod.ecosec.on.epicgames.com",
    prod_akamai: "https://talon-service-prod.ak.epicgames.com",
    prod_cloudflare: "https://talon-service-prod.ecosec.on.epicgames.com"
  };

  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) {
        descriptor.writable = true;
      }
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  var lastTimeout;
  var CircularBuffer = function () {
    function CircularBuffer(maxSize, throttleDelay) {
      var self = this;
      if (!(this instanceof CircularBuffer)) {
        throw new TypeError("Cannot call a class as a function");
      }
      this.maxSize = maxSize;
      this.pushThrottle = throttleDelay ? function (delay, callback, options) {
        var timeoutId;
        var defaultOptions = options || {};
        var noTrailing = defaultOptions.noTrailing !== undefined ? defaultOptions.noTrailing : false;
        var noLeading = defaultOptions.noLeading !== undefined ? defaultOptions.noLeading : false;
        var debounceMode = defaultOptions.debounceMode === undefined ? undefined : defaultOptions.debounceMode;
        var isThrottled = false;
        var lastExecution = 0;
        function clearExistingTimeout() {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
        function throttledFunction() {
          var context = this;
          var args = arguments;
          var now = Date.now();
          var remainingTime = delay - (now - lastExecution);
          function executeCallback() {
            lastExecution = Date.now();
            callback.apply(context, args);
          }
          function resetTimer() {
            timeoutId = undefined;
          }
          if (!isThrottled) {
            if (!noLeading && !!debounceMode && !timeoutId) {
              executeCallback();
            }
            clearExistingTimeout();
            if (debounceMode === undefined && remainingTime <= 0) {
              if (noLeading) {
                lastExecution = Date.now();
                if (!noTrailing) {
                  timeoutId = setTimeout(debounceMode ? resetTimer : executeCallback, delay);
                }
              } else {
                executeCallback();
              }
            } else if (noTrailing !== true) {
              timeoutId = setTimeout(debounceMode ? resetTimer : executeCallback, debounceMode === undefined ? remainingTime : delay);
            }
          }
        }
        throttledFunction.cancel = function (options) {
          var cancelUpcomingOnly = (options || {}).upcomingOnly !== undefined ? options.upcomingOnly : false;
          clearExistingTimeout();
          isThrottled = !cancelUpcomingOnly;
        };
        return throttledFunction;
      }(throttleDelay, function (item) {
        self.buffer.push(item);
        if (self.buffer.length > self.maxSize) {
          self.buffer.shift();
        }
      }) : function (item) {
        self.buffer.push(item);
        if (self.buffer.length > self.maxSize) {
          self.buffer.shift();
        }
      };
      this.buffer = [];
    }
    var prototype;
    var staticProps;
    prototype = CircularBuffer;
    if (staticProps = [{
      key: "push",
      value: function (item) {
        this.pushThrottle(item);
      }
    }, {
      key: "peek",
      value: function () {
        return this.buffer;
      }
    }, {
      key: "drain",
      value: function () {
        var currentBuffer = this.buffer;
        this.buffer = [];
        return currentBuffer;
      }
    }]) {
      defineProperties(prototype.prototype, staticProps);
    }
    Object.defineProperty(prototype, "prototype", {
      writable: false
    });
    return CircularBuffer;
  }();
  var pendingRequests = [];
  var completedRequests = [];
  var eventBuffer = new CircularBuffer(50);
  var SDK_ERROR = "sdk_error";
  function logEvent(environment, event) {
    return logEventAsync.apply(this, arguments);
  }
  function logEventAsync() {
    return (logEventAsync = asyncToGenerator(regeneratorRuntime.mark(function logEventGenerator(environment, event) {
      return regeneratorRuntime.wrap(function logEventIterator(context) {
        while (true) {
          switch (context.prev = context.next) {
            case 0:
              var eventData = {
                env: environment,
                event: event
              };
              eventBuffer.push(eventData);
            case 1:
            case "end":
              return context.stop();
          }
        }
      }, logEventGenerator);
    }))).apply(this, arguments);
  }
  function flushEvents() {
    flushEvents = asyncToGenerator(regeneratorRuntime.mark(function flushEventsGenerator() {
      var eventsByEnvironment;
      var environment;
      var events;
      var axiosInstance;
      var headers;
      return regeneratorRuntime.wrap(function flushEventsIterator(context) {
        while (true) {
          switch (context.prev = context.next) {
            case 0:
              eventsByEnvironment = {};
              eventBuffer.drain().forEach(function (eventData) {
                if (eventData != null && eventData.event) {
                  var envUrl = getEnvironmentUrl(eventData == null ? undefined : eventData.env);
                  if (eventsByEnvironment[envUrl]) {
                    eventsByEnvironment[envUrl].push(eventData.event);
                  } else {
                    eventsByEnvironment[envUrl] = [eventData.event];
                  }
                }
              });
              context.t0 = regeneratorRuntime.keys(eventsByEnvironment);
            case 3:
              if ((context.t1 = context.t0()).done) {
                context.next = 20;
                break;
              }
              environment = context.t1.value;
              events = eventsByEnvironment[environment];
              setupAxiosRetry(axiosInstance = axios.create({
                baseURL: environmentUrls[getEnvironmentUrl(environment)],
                timeout: 25000
              }), {
                retries: 3,
                shouldResetTimeout: true,
                retryCondition: function (error) {
                  return setupAxiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === "ECONNABORTED";
                },
                retryDelay: exponentialDelay
              });
              context.prev = 8;
              headers = {};
              if (talon?.session?.session?.config?.acid && talon?.session?.session?.config?.acid.includes("xenon")) {
                headers["X-Acid-Xenon"] = talon.session.session.id;
              }
              context.next = 13;
              return axiosInstance.post("/v1/phaser/batch", events, {
                withCredentials: true,
                headers: headers
              });
            case 13:
              context.next = 18;
              break;
            case 15:
              context.prev = 15;
              context.t2 = context.catch(8);
              console.error(context.t2);
            case 18:
              context.next = 3;
              break;
            case 20:
            case "end":
              return context.stop();
          }
        }
      }, flushEventsGenerator, null, [[8, 15]]);
    }));
    return flushEvents.apply(this, arguments);
  }

  function recordEvent(environment, eventName, sessionData) {
    var timestamp = new Date().toISOString();
    var eventData = {
      event: eventName,
      timestamp: timestamp
    };
    eventQueue.push(eventData);
    if (eventQueue.length < 50) {
      sendData(environment, {
        event: eventName,
        session: sessionData,
        timing: eventQueue,
        errors: errorQueue
      }).catch(console.error);
    }
  }

  function recordError(environment, errorType, sessionData, errorMessage, stackTrace) {
    console.error(errorMessage, stackTrace);
    var errorData = {
      type: errorType,
      timestamp: new Date().toISOString(),
      message: errorMessage,
      stack_trace: stackTrace
    };
    errorQueue.push(errorData);
    if (errorQueue.length < 50) {
      sendData(environment, {
        event: errorType,
        session: sessionData,
        timing: eventQueue,
        errors: errorQueue,
        error: errorData
      }).catch(console.error);
    }
  }

  function sliceArray(array, length) {
    if (length == null || length > array.length) {
      length = array.length;
    }
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      result[i] = array[i];
    }
    return result;
  }

  function parseIterable(iterable, maxLength) {
    if (Array.isArray(iterable)) {
      return iterable;
    }
    if (iterable == null) {
      return null;
    }
    var iterator = typeof Symbol !== "undefined" && iterable[Symbol.iterator] || iterable["@@iterator"];
    if (iterator != null) {
      var result = [];
      var isDone = false;
      try {
        for (iterator = iterator.call(iterable); !(isDone = (step = iterator.next()).done) && (result.push(step.value), !maxLength || result.length !== maxLength); isDone = true);
      } catch (error) {
        console.error(error);
      } finally {
        try {
          if (!isDone && iterator.return != null) {
            iterator.return();
          }
        } finally {
          if (error) {
            throw error;
          }
        }
      }
      return result;
    }
    if (typeof iterable === "string") {
      return sliceArray(iterable, maxLength);
    }
    var objectType = Object.prototype.toString.call(iterable).slice(8, -1);
    if (objectType === "Object" && iterable.constructor) {
      objectType = iterable.constructor.name;
    }
    if (objectType === "Map" || objectType === "Set") {
      return Array.from(iterable);
    }
    if (objectType === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(objectType)) {
      return sliceArray(iterable, maxLength);
    }
    return undefined;
  }

  function defineProperty(object, property, value) {
    var descriptor = {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    };
    if (property in object) {
      Object.defineProperty(object, property, descriptor);
    } else {
      object[property] = value;
    }
    return object;
  }

  function getCurrentTimestamp() {
    try {
      return new Date().toISOString();
    } catch (error) {
      recordError(talon.env, "TIMESTAMP_ERROR", talon.session, error.message, error.stack);
    }
  }

  function generateUniqueId() {
    var uniqueId = Math.floor(Math.pow(10, 16) * Math.random()).toString(16);
    if (talon?.session?.session?.config?.acid && talon?.session?.session?.config?.acid.includes("iridium")) {
      uniqueId += uniqueId.substr(3, 3);
    }
    try {
      return uniqueId;
    } catch (error) {
      recordError(talon.env, "ID_GENERATION_ERROR", talon.session, error.message, error.stack);
    }
  }

  function getPageInfo() {
    try {
      var pageInfo = {
        title: document.title,
        referrer: document.referrer
      };
      return pageInfo;
    } catch (error) {
      recordError(talon.env, "PAGE_INFO_ERROR", talon.session, error.message, error.stack);
    }
  }

  function findMissingKeys(object1, object2) {
    var missingKeys = [];
    try {
      for (var key in object1) {
        if (!object2[key]) {
          missingKeys.push(key);
        }
      }
      return missingKeys;
    } catch (error) {
      recordError(talon.env, "MISSING_KEYS_ERROR", talon.session, error.message, error.stack);
    }
  }

  function getBrowserInfo() {
    try {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        product: navigator.product,
        productSub: navigator.productSub,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
        webdriver: navigator.webdriver,
        maxTouchPoints: navigator.maxTouchPoints,
        cookieEnabled: navigator.cookieEnabled,
        propertyList: getNavigatorProperties(navigator, {}),
        connectionRtt: navigator.connection?.rtt
      };
    } catch (error) {
      recordError(talon.env, "BROWSER_INFO_ERROR", talon.session, error.message, error.stack);
    }
  }

  const md5 = require('md5');
  const tlsh = require('tlsh');

  function getCanvasFingerprint() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      const text = "👾 https://www.epicgames.com/site/en-US/careers 🔒 https://hackerone.com/epicgames 🕹️";

      ctx.font = "14px 'Arial'";
      ctx.fillStyle = "#333";
      ctx.fillRect(30, 0, 183, 90);
      ctx.fillStyle = "#4287f5";
      ctx.fillRect(450, 1, 200, 90);

      const gradient = ctx.createLinearGradient(250, 0, 600, 50);
      gradient.addColorStop(0, "black");
      gradient.addColorStop(0.5, "cyan");
      gradient.addColorStop(1, "yellow");
      ctx.fillStyle = gradient;
      ctx.fillRect(300, 7, 200, 100);

      ctx.fillStyle = "#42f584";
      ctx.fillText(text, 0, 15);
      ctx.strokeStyle = "rgba(255, 0, 50, 0.7)";
      ctx.strokeText(text, 20, 20);
      ctx.fillStyle = "rgba(245, 66, 66, 0.5)";
      ctx.fillRect(100, 10, 50, 50);

      const dataUrl = canvas.toDataURL();
      const imageData = ctx.getImageData(0, 0, 600, 50);
      const colorCounts = {};

      for (let i = 0; i < imageData.data.length; i += 4) {
        const color = imageData.data.slice(i, i + 4).join('');
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }

      return {
        length: dataUrl.length,
        numColors: Object.keys(colorCounts).length,
        md5: md5(dataUrl),
        tlsh: tlsh(dataUrl)
      };
    } catch (error) {
      recordError(talon.env, "CANVAS_FINGERPRINT_ERROR", talon.session, error.message, error.stack);
    }
  }

  let webglInfo;

  function getWebGLInfo() {
    if (webglInfo) {
      return webglInfo;
    }

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl2") || canvas.getContext("experimental-webgl");

      if (!gl) {
        return {
          canvasFingerprint: getCanvasFingerprint()
        };
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      webglInfo = {
        canvasFingerprint: getCanvasFingerprint(),
        parameters: {
          renderer: debugInfo && gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
          vendor: debugInfo && gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        }
      };

      return webglInfo;
    } catch (error) {
      recordError(talon.env, "WEBGL_INFO_ERROR", talon.session, error.message, error.stack);
    }
  }

  function getResourceNames() {
    try {
      if (!window.performance?.getEntriesByType) {
        return;
      }

      return window.performance.getEntriesByType("resource")
        .filter(entry => entry.name.length < 512)
        .map(entry => entry.name);
    } catch (error) {
      recordError(talon.env, "RESOURCE_NAMES_ERROR", talon.session, error.message, error.stack);
    }
  }

  function isDarkModeEnabled() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (error) {
      recordError(talon.env, "DARK_MODE_ERROR", talon.session, error.message, error.stack);
    }
  }

  function getLocationInfo() {
    try {
      return {
        origin: window.location.origin,
        pathname: window.location.pathname,
        href: window.location.href
      };
    } catch (error) {
      console.error(error);
    }
  }

  function getHistoryInfo() {
    try {
      return {
        length: window.history.length
      };
    } catch (error) {
      recordError(talon.env, "HISTORY_INFO_ERROR", talon.session, error.message, error.stack);
    }
  }

  function getScreenInfo() {
    try {
      return {
        availHeight: window.screen.availHeight,
        availWidth: window.screen.availWidth,
        availTop: window.screen.availTop,
        height: window.screen.height,
        width: window.screen.width,
        colorDepth: window.screen.colorDepth
      };
    } catch (error) {
      recordError(talon.env, "SCREEN_INFO_ERROR", talon.session, error.message, error.stack);
    }
  }

  function getPerformanceInfo() {
    try {
      const memoryInfo = {
        jsHeapSizeLimit: window.performance.memory?.jsHeapSizeLimit,
        totalJSHeapSize: window.performance.memory?.totalJSHeapSize,
        usedJSHeapSize: window.performance.memory?.usedJSHeapSize
      };

      return {
        memory: memoryInfo,
        resources: getResourceNames()
      };
    } catch (error) {
      recordError(talon.env, "PERFORMANCE_INFO_ERROR", talon.session, error.message, error.stack);
    }
  }

  async function getWindowInfo() {
    return {
      location: getLocationInfo(),
      history: getHistoryInfo(),
      screen: getScreenInfo(),
      performance: getPerformanceInfo(),
      devicePixelRatio: window.devicePixelRatio,
      darkMode: isDarkModeEnabled(),
      chrome: !!window.chrome,
      propertyList: getWindowProperties()
    };
  }

  function getWindowProperties() {
    let properties = getObjectProperties(window, {});
    
    if (isAtobModified()) {
      properties = properties.map(prop => prop === "atob" ? "atob‹" : prop);
    }

    return properties;
  }

  function isAtobModified() {
    if (!atob) {
      return false;
    }

    const randomCount = Math.floor(Math.random() * 100);
    for (let i = 0; i < randomCount; i++) {
      atob[Symbol.for(`${i}`)] = "test";
    }

    const isModified = Object.getOwnPropertySymbols(atob).length !== randomCount;

    for (let i = 0; i < randomCount; i++) {
      delete atob[Symbol.for(`${i}`)];
    }

    return isModified;
  }

  return function () {
    return originalFunction.apply(this, arguments);
  };
}();

function getDateTimeFormatInfo() {
  try {
    const options = Intl.DateTimeFormat().resolvedOptions();
    const formatInfo = {
      calendar: options.calendar,
      day: options.day,
      locale: options.locale,
      month: options.month,
      numberingSystem: options.numberingSystem,
      timeZone: options.timeZone,
      year: options.year
    };
    return {
      timezoneOffset: new Date().getTimezoneOffset(),
      format: formatInfo
    };
  } catch (error) {
    logError(talon.env, errorCode, talon.session, error.message, error.stack);
  }
}

function checkIframeSrcDoc() {
  try {
    const iframe = document.createElement("iframe");
    return !!iframe.srcdoc && iframe.srcdoc !== "";
  } catch (error) {
    return true;
  }
}

function getSdRecurse() {
  try {
    return {
      sd_recurse: checkIframeSrcDoc()
    };
  } catch (error) {
    logError(talon.env, errorCode, talon.session, error.message, error.stack);
  }
}

function objectAssign() {
  objectAssign = Object.assign || function (target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return objectAssign.apply(this, arguments);
}

/**
 * Asynchronous function wrapper
 * @param {Object} thisArg - The 'this' context for the generator function
 * @param {Array} args - Arguments to pass to the generator function
 * @param {Function} PromiseImpl - Custom Promise implementation (optional)
 * @param {Function} generator - Generator function to be executed
 * @returns {Promise} A promise that resolves with the generator's final value
 */
function asyncFunction(thisArg, args, PromiseImpl, generator) {
  return new (PromiseImpl ||= Promise)(function (resolve, reject) {
    function step(result) {
      try {
        gen.next(result);
      } catch (error) {
        reject(error);
      }
    }
    function handleError(error) {
      try {
        gen.throw(error);
      } catch (rejectedError) {
        reject(rejectedError);
      }
    }
    function handle(result) {
      if (result.done) {
        resolve(result.value);
      } else {
        Promise.resolve(result.value).then(step, handleError);
      }
    }
    const gen = generator.apply(thisArg, args || []);
    handle(gen.next());
  });
}


/**
 * Creates an async generator object with methods for iteration control.
 * @param {Function} generator - The generator function to be wrapped.
 * @returns {Object} An async iterator object with next, throw, and return methods.
 */
function asyncGenerator(generator) {
  const context = {
    label: 0,
    sent: function () {
      if (info[0] & 1) throw info[1];
      return info[1];
    },
    trys: [],
    ops: []
  };
  let info, value;
  const asyncIterator = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  };
  if (typeof Symbol === "function") {
    asyncIterator[Symbol.iterator] = function () {
      return this;
    };
  }
  return asyncIterator;
}
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    // Check if the generator is already executing
    if (value) throw new TypeError("Generator is already executing.");
    while (context) {
      try {
        // Handle different operations based on the op array
        if (value = 0, op[0] & 2 ? context.sent() : op[0] ? context.throw || ((value = context.sent()) && value.throw(op[1]), 0) : context.next) {
          if (!(info = info.call(context, op[1])).done) return info;
        }
        if (value = 0, info) op = [op[0] & 2, info.value];
        switch (op[0]) {
          case 0:
          case 1:
            info = op;
            break;
          case 4:
            // Increment label and return a non-done result
            context.label++;
            return { value: op[1], done: false };
          case 5:
            // Increment label, set value, and continue
            context.label++;
            value = op[1];
            op = [0];
            continue;
          case 7:
            // Pop operations and try blocks
            op = context.ops.pop();
            context.trys.pop();
            continue;
          default:
            // Handle various edge cases and state transitions
            if (!(info = context.trys, info = info.length > 0 && info[info.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              context = 0;
              continue;
            }
            if (op[0] === 3 && (!info || (op[1] > info[0] && op[1] < info[3]))) {
              context.label = op[1];
              break;
            }
            if (op[0] === 6 && context.label < info[1]) {
              context.label = info[1];
              info = op;
              break;
            }
            if (info && context.label < info[2]) {
              context.label = info[2];
              context.ops.push(op);
              break;
            }
            if (info[2]) context.ops.pop();
            context.trys.pop();
            continue;
        }
        // Call the generator with the current context
        op = generator.call(thisArg, context);
      } catch (e) {
        // Handle exceptions
        op = [6, e];
        value = 0;
      } finally {
        // Reset info and value
        info = value = 0;
      }
    }
    // Throw if op[0] is 5 (error), otherwise return the result
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : undefined, done: true };
  }
}

function spreadArray(target, source, useSourceProperties) {
  if (useSourceProperties || arguments.length === 2) {
    var spreadArray;
    for (var i = 0, len = source.length; i < len; i++) {
      if (!!spreadArray || !(i in source)) {
        spreadArray ||= Array.prototype.slice.call(source, 0, i);
        spreadArray[i] = source[i];
      }
    }
  }
  return target.concat(spreadArray || Array.prototype.slice.call(source));
}

Object.create;
Object.create;

if (typeof SuppressedError == "function") {
  SuppressedError;
}

var VERSION = "3.4.2";

function delay(ms, value) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms, value);
  });
}

function isPromise(obj) {
  return !!obj && typeof obj.then == "function";
}

function tryExecute(fn, callback) {
  try {
    var result = fn();
    if (isPromise(result)) {
      result.then(
        function (value) { return callback(true, value); },
        function (error) { return callback(false, error); }
      );
    } else {
      callback(true, result);
    }
  } catch (error) {
    callback(false, error);
  }
}

function processArrayWithTimeout(array, processor, timeout = 16) {
  return executeAsyncGenerator(this, undefined, undefined, function* () {
    var result = Array(array.length);
    var startTime = Date.now();
    var i = 0;
    while (i < array.length) {
      result[i] = processor(array[i], i);
      if ((Date.now()) >= startTime + timeout) {
        startTime = Date.now();
        yield delay(0);
      }
      ++i;
    }
    return result;
  });
}

function ignorePromiseErrors(promise) {
  promise.then(undefined, function () {});
}

function addUint32(a, b) {
  a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] & 65535];
  b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] & 65535];
  var result = [0, 0, 0, 0];
  result[3] += a[3] + b[3];
  result[2] += result[3] >>> 16;
  result[3] &= 65535;
  result[2] += a[2] + b[2];
  result[1] += result[2] >>> 16;
  result[2] &= 65535;
  result[1] += a[1] + b[1];
  result[0] += result[1] >>> 16;
  result[1] &= 65535;
  result[0] += a[0] + b[0];
  result[0] &= 65535;
  return [result[0] << 16 | result[1], result[2] << 16 | result[3]];
}

function multiplyUint32(a, b) {
  a = [a[0] >>> 16, a[0] & 65535, a[1] >>> 16, a[1] & 65535];
  b = [b[0] >>> 16, b[0] & 65535, b[1] >>> 16, b[1] & 65535];
  var result = [0, 0, 0, 0];
  result[3] += a[3] * b[3];
  result[2] += result[3] >>> 16;
  result[3] &= 65535;
  result[2] += a[2] * b[3];
  result[1] += result[2] >>> 16;
  result[2] &= 65535;
  result[2] += a[3] * b[2];
  result[1] += result[2] >>> 16;
  result[2] &= 65535;
  result[1] += a[1] * b[3];
  result[0] += result[1] >>> 16;
  result[1] &= 65535;
  result[1] += a[2] * b[2];
  result[0] += result[1] >>> 16;
  result[1] &= 65535;
  result[1] += a[3] * b[1];
  result[0] += result[1] >>> 16;
  result[1] &= 65535;
  result[0] += a[0] * b[3] + a[1] * b[2] + a[2] * b[1] + a[3] * b[0];
  result[0] &= 65535;
  return [result[0] << 16 | result[1], result[2] << 16 | result[3]];
}

function rotateUint32(value, shift) {
  shift %= 64;
  if (shift == 32) {
    return [value[1], value[0]];
  } else if (shift < 32) {
    return [value[0] << shift | value[1] >>> (32 - shift), value[1] << shift | value[0] >>> (32 - shift)];
  } else {
    shift -= 32;
    return [value[1] << shift | value[0] >>> (32 - shift), value[0] << shift | value[1] >>> (32 - shift)];
  }
}

function shiftLeftUint32(value, shift) {
  shift %= 64;
  if (shift == 0) {
    return value;
  } else if (shift < 32) {
    return [value[0] << shift | value[1] >>> (32 - shift), value[1] << shift];
  } else {
    return [value[1] << (shift - 32), 0];
  }
}

function xorUint32(a, b) {
  return [a[0] ^ b[0], a[1] ^ b[1]];
}

function finalizeUint32(value) {
  value = xorUint32(value, [0, value[0] >>> 1]);
  value = xorUint32(value = multiplyUint32(value, [4283543511, 3981806797]), [0, value[0] >>> 1]);
  return xorUint32(value = multiplyUint32(value, [3301882366, 444984403]), [0, value[0] >>> 1]);
}

function parseInteger(value) {
  return parseInt(value);
}

function parseFloat(value) {
  return parseFloat(value);
}

function defaultIfNaN(value, defaultValue) {
  if (typeof value == "number" && isNaN(value)) {
    return defaultValue;
  } else {
    return value;
  }
}

function countTruthy(array) {
  return array.reduce(function (count, item) {
    return count + (item ? 1 : 0);
  }, 0);
}

function roundToNearest(value, step = 1) {
  if (Math.abs(step) >= 1) {
    return Math.round(value / step) * step;
  }
  var inverseStep = 1 / step;
  return Math.round(value * inverseStep) / inverseStep;
}

function normalizeError(error) {
  if (error && typeof error == "object" && "message" in error) {
    return error;
  } else {
    return {
      message: error
    };
  }
function isNotFunction(value) {
  return typeof value != "function";
}

function isMicrosoftBrowser() {
  var window = window;
  var navigator = navigator;
  return countTruthy(["MSCSSMatrix" in window, "msSetImmediate" in window, "msIndexedDB" in window, "msMaxTouchPoints" in navigator, "msPointerEnabled" in navigator]) >= 4;
}

function isChromeBrowser() {
  var window = window;
  var navigator = navigator;
  return countTruthy(["webkitPersistentStorage" in navigator, "webkitTemporaryStorage" in navigator, navigator.vendor.indexOf("Google") === 0, "webkitResolveLocalFileSystemURL" in window, "BatteryManager" in window, "webkitMediaStream" in window, "webkitSpeechGrammar" in window]) >= 5;
}

function isAppleBrowser() {
  var window = window;
  var navigator = navigator;
  return countTruthy(["ApplePayError" in window, "CSSPrimitiveValue" in window, "Counter" in window, navigator.vendor.indexOf("Apple") === 0, "getStorageUpdates" in navigator, "WebKitMediaKeys" in window]) >= 4;
}

function isSafariBrowser() {
  var window = window;
  return countTruthy(["safari" in window, !("DeviceMotionEvent" in window), !("ongestureend" in window), !("standalone" in navigator)]) >= 3;
}

function exitFullscreen() {
  var document = document;
  return (document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen).call(document);
}

function isMobileBrowser() {
  var isChrome = isChromeBrowser();
  var isFirefox = (function() {
    var window = window;
    return countTruthy(["buildID" in navigator, "MozAppearance" in (document.documentElement?.style ?? {}), "onmozfullscreenchange" in window, "mozInnerScreenX" in window, "CSSMozDocumentRule" in window, "CanvasCaptureMediaStream" in window]) >= 4;
  })();
  if (!isChrome && !isFirefox) {
    return false;
  }
  var window = window;
  return countTruthy(["onorientationchange" in window, "orientation" in window, isChrome && !("SharedWorker" in window), isFirefox && /android/i.test(navigator.appVersion)]) >= 2;
}

function createError(message) {
  var error = new Error(message);
  error.name = message;
  return error;
}

function createIframe(callback, html, timeout) {
  var iframe;
  if (timeout === undefined) {
    timeout = 50;
  }
  return executeAsyncFunction(this, undefined, undefined, function() {
    var document;
    var iframeElement;
    return generateAsyncSteps(this, function(step) {
      switch (step.label) {
        case 0:
          document = document;
          step.label = 1;
        case 1:
          if (document.body) {
            return [3, 3];
          } else {
            return [4, delay(timeout)];
          }
        case 2:
          step.sent();
          return [3, 1];
        case 3:
          iframeElement = document.createElement("iframe");
          step.label = 4;
        case 4:
          step.trys.push([4,, 10, 11]);
          return [4, new Promise(function(resolve, reject) {
            var loaded = false;
            function onLoad() {
              loaded = true;
              resolve();
            }
            iframeElement.onload = onLoad;
            iframeElement.onerror = function(error) {
              loaded = true;
              reject(error);
            };
            var style = iframeElement.style;
            style.setProperty("display", "block", "important");
            style.position = "absolute";
            style.top = "0";
            style.left = "0";
            style.visibility = "hidden";
            if (html && "srcdoc" in iframeElement) {
              iframeElement.srcdoc = html;
            } else {
              iframeElement.src = "about:blank";
            }
            document.body.appendChild(iframeElement);
            function checkReadyState() {
              if (!loaded) {
                if (iframeElement.contentWindow?.document?.readyState === "complete") {
                  onLoad();
                } else {
                  setTimeout(checkReadyState, 10);
                }
              }
            }
            checkReadyState();
          })];
        case 5:
          step.sent();
          step.label = 6;
        case 6:
          if (iframeElement.contentWindow?.document?.body) {
            return [3, 8];
          } else {
            return [4, delay(timeout)];
          }
        case 7:
          step.sent();
          return [3, 6];
        case 8:
          return [4, callback(iframeElement, iframeElement.contentWindow)];
        case 9:
          return [2, step.sent()];
        case 10:
          if ((iframe = iframeElement.parentNode) !== null && iframe !== undefined) {
            iframe.removeChild(iframeElement);
          }
          return [7];
        case 11:
          return [2];
      }
    });
  });
}

function createElementFromSelector(selector) {
  var parsedSelector = (function(selector) {
    var errorMessage = `Unexpected syntax '${selector}'`;
    var match = /^\s*([a-z-]*)(.*)$/i.exec(selector);
    var tag = match[1] || undefined;
    var attributes = {};
    var attributeRegex = /([.:#][\w-]+|\[.+?\])/gi;
    function addAttribute(name, value) {
      attributes[name] = attributes[name] || [];
      attributes[name].push(value);
    }
    while (true) {
      var attributeMatch = attributeRegex.exec(match[2]);
      if (!attributeMatch) {
        break;
      }
      var attribute = attributeMatch[0];
      switch (attribute[0]) {
        case ".":
          addAttribute("class", attribute.slice(1));
          break;
        case "#":
          addAttribute("id", attribute.slice(1));
          break;
        case "[":
          var attributeParts = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(attribute);
          if (!attributeParts) {
            throw new Error(errorMessage);
          }
          addAttribute(attributeParts[1], attributeParts[4] ?? attributeParts[5] ?? "");
          break;
        default:
          throw new Error(errorMessage);
      }
    }
    return [tag, attributes];
  })(selector);
  var tag = parsedSelector[0];
  var attributes = parsedSelector[1];
  var element = document.createElement(tag ?? "div");
  for (var i = 0, keys = Object.keys(attributes); i < keys.length; i++) {
    var key = keys[i];
    var value = attributes[key].join(" ");
    if (key === "style") {
      setStyleProperties(element.style, value);
    } else {
      element.setAttribute(key, value);
    }
  }
  return element;
}

function setStyleProperties(style, properties) {
  for (var i = 0, propertyList = properties.split(";"); i < propertyList.length; i++) {
    var property = propertyList[i];
    var propertyMatch = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(property);
    if (propertyMatch) {
      var name = propertyMatch[1];
      var value = propertyMatch[2];
      var priority = propertyMatch[4];
      style.setProperty(name, value, priority || "");
    }
  }
}

var fontList;
var testFonts;
var baseFonts = ["monospace", "sans-serif", "serif"];
var testFontList = ["sans-serif-thin", "ARNO PRO", "Agency FB", "Arabic Typesetting", "Arial Unicode MS", "AvantGarde Bk BT", "BankGothic Md BT", "Batang", "Bitstream Vera Sans Mono", "Calibri", "Century", "Century Gothic", "Clarendon", "EUROSTILE", "Franklin Gothic", "Futura Bk BT", "Futura Md BT", "GOTHAM", "Gill Sans", "HELV", "Haettenschweiler", "Helvetica Neue", "Humanst521 BT", "Leelawadee", "Letter Gothic", "Levenim MT", "Lucida Bright", "Lucida Sans", "Menlo", "MS Mincho", "MS Outlook", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MYRIAD PRO", "Marlett", "Meiryo UI", "Microsoft Uighur", "Minion Pro", "Monotype Corsiva", "PMingLiU", "Pristina", "SCRIPTINA", "Segoe UI Light", "Serifa", "SimHei", "Small Fonts", "Staccato222 BT", "TRAJAN PRO", "Univers CE 55 Medium", "Vrinda", "ZWAdobeF"];

function getCanvasDataUrl(canvas) {
  return canvas.toDataURL();
}

function getScreenEdges() {
  var screen = screen;
  return [
    defaultIfNaN(parseInteger(screen.availTop), null),
    defaultIfNaN(parseInteger(screen.width) - parseInteger(screen.availWidth) - defaultIfNaN(parseInteger(screen.availLeft), 0), null),
    defaultIfNaN(parseInteger(screen.height) - parseInteger(screen.availHeight) - defaultIfNaN(parseInteger(screen.availTop), 0), null),
    defaultIfNaN(parseInteger(screen.availLeft), null)
  ];
}

function isScreenEdgeHidden(edges) {
  for (var i = 0; i < 4; ++i) {
    if (edges[i]) {
      return false;
    }
  }
  return true;
}

function testDOMElements(selectors) {
  var result;
  return executeAsyncFunction(this, undefined, undefined, function() {
    var document;
    var container;
    var elements;
    var hiddenElements;
    var element;
    var i;
    return generateAsyncSteps(this, function(step) {
      switch (step.label) {
        case 0:
          document = document;
          container = document.createElement("div");
          elements = new Array(selectors.length);
          hiddenElements = {};
          setInvisibleStyle(container);
          i = 0;
          for (; i < selectors.length; ++i) {
            if ((element = createElementFromSelector(selectors[i])).tagName === "DIALOG") {
              element.show();
            }
            setInvisibleStyle(element = document.createElement("div"));
            element.appendChild(element);
            container.appendChild(element);
            elements[i] = element;
          }
          step.label = 1;
        case 1:
          if (document.body) {
            return [3, 3];
          } else {
            return [4, delay(50)];
          }
        case 2:
          step.sent();
          return [3, 1];
        case 3:
          document.body.appendChild(container);
          try {
            for (i = 0; i < selectors.length; ++i) {
              if (!elements[i].offsetParent) {
                hiddenElements[selectors[i]] = true;
              }
            }
          } finally {
            if ((result = container.parentNode) !== null && result !== undefined) {
              result.removeChild(container);
            }
          }
          return [2, hiddenElements];
      }
    });
  });
}

function setInvisibleStyle(element) {
  element.style.setProperty("display", "block", "important");
  element.style.position = "absolute";
  element.style.left = "0";
  element.style.top = "0";
  element.style.width = "0";
  element.style.height = "0";
  element.style.padding = "0";
  element.style.margin = "0";
  element.style.border = "none";
  element.style.visibility = "hidden";
}      function _0x580c47(_0x5eed27) {
        _0x5eed27.style.setProperty("display", "block", "important");
      }
      function _0x5f3476(_0x36afb3) {
        return matchMedia(`(inverted-colors: ${_0x36afb3})`).matches;
      }
      function _0x2e2cd2(_0x14ab60) {
        return matchMedia(`(forced-colors: ${_0x14ab60})`).matches;
      }
      function _0x3878ca(_0x39b516) {
        return matchMedia(`(prefers-contrast: ${_0x39b516})`).matches;
      }
      function _0x2c1092(_0x22b56d) {
        return matchMedia(`(prefers-reduced-motion: ${_0x22b56d})`).matches;
      }
      function _0x594934(_0x36ea42) {
        return matchMedia(`(dynamic-range: ${_0x36ea42})`).matches;
      }
      var _0x4daef4 = Math;
      function _0x43d1b6() {
        return 0;
      }
      var _0x37a7fc = {
        default: [],
        apple: [{
          font: "-apple-system-body"
        }],
        serif: [{
          fontFamily: "serif"
        }],
        sans: [{
          fontFamily: "sans-serif"
        }],
        mono: [{
          fontFamily: "monospace"
        }],
        min: [{
          fontSize: "1px"
        }],
        system: [{
          fontFamily: "system-ui"
        }]
      };
      var audioFingerprint = {
        fonts: function () {
          return getAsyncResult(function (resolve, context) {
            var doc = context.document;
            var body = doc.body;
            body.style.fontSize = "48px";
            var container = doc.createElement("div");
            var baseFontWidths = {};
            var baseFontHeights = {};
            function createSpan(fontFamily) {
              var span = doc.createElement("span");
              var style = span.style;
              style.position = "absolute";
              style.top = "0";
              style.left = "0";
              style.fontFamily = fontFamily;
              span.textContent = "mmMwWLliI0O&1";
              container.appendChild(span);
              return span;
            }
            var baselineSpans = baseFonts.map(createSpan);
            var testFonts = function () {
              var fontSpans = {};
              var addFontSpan = function (font) {
                fontSpans[font] = baseFonts.map(function (baseFont) {
                  return createSpan(`'${font}',${baseFont}`);
                });
              };
              for (var i = 0, fonts = testFontList; i < fonts.length; i++) {
                addFontSpan(fonts[i]);
              }
              return fontSpans;
            }();
            body.appendChild(container);
            for (var i = 0; i < baseFonts.length; i++) {
              baseFontWidths[baseFonts[i]] = baselineSpans[i].offsetWidth;
              baseFontHeights[baseFonts[i]] = baselineSpans[i].offsetHeight;
            }
            return testFontList.filter(function (font) {
              var testSpans = testFonts[font];
              return baseFonts.some(function (baseFont, index) {
                return testSpans[index].offsetWidth !== baseFontWidths[baseFont] || testSpans[index].offsetHeight !== baseFontHeights[baseFont];
              });
            });
          });
        },
        domBlockers: function (options) {
          var debug = (options === undefined ? {} : options).debug;
          return __awaiter(this, undefined, undefined, function () {
            var blockers, filterNames, activeBlockers;
            return __generator(this, function (state) {
              switch (state.label) {
                case 0:
                  if (isWebKit() || isAndroid()) {
                    blockers = {
                      adBlockers: ["#ad-block", ".ad-banner", "#sponsored-content"],
                      socialMediaBlockers: [".social-button", "#share-buttons", ".follow-us"],
                      cookieNotices: [".cookie-notice", "#gdpr-consent", ".privacy-policy"],
                      newsletterPopups: ["#newsletter-signup", ".subscribe-form", "#email-capture"],
                      videoAds: [".pre-roll-ad", "#video-overlay", ".ad-container"]
                    };
                    filterNames = Object.keys(blockers);
                    return [4, getBlockedSelectors(filterNames.flatMap(function (name) {
                      return blockers[name];
                    }))];
                  } else {
                    return [2, undefined];
                  }
                case 1:
                  activeBlockers = state.sent();
                  if (debug) {
                    logBlockerResults(blockers, activeBlockers);
                  }
                  return [2, filterNames.filter(function (name) {
                    var selectors = blockers[name];
                    return getActiveBlockerPercentage(selectors.map(function (selector) {
                      return activeBlockers[selector];
                    })) > selectors.length * 0.6;
                  }).sort()];
              }
            });
          });
        },
        fontPreferences: function () {
          var defaultWidth = 4000;
          return getAsyncResult(function (resolve, context) {
            var doc = context.document;
            var body = doc.body;
            var bodyStyle = body.style;
            bodyStyle.width = defaultWidth + "px";
            bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = "none";
            if (isWebKit()) {
              body.style.zoom = "" + (1 / context.devicePixelRatio);
            } else if (isFirefox()) {
              body.style.zoom = "reset";
            }
            var container = doc.createElement("div");
            container.textContent = Array(defaultWidth / 20 << 0).fill("word").join(" ");
            body.appendChild(container);
            return function (document, parent) {
              var elements = {};
              var sizes = {};
              for (var _i = 0, _a = Object.keys(fontList); _i < _a.length; _i++) {
                var font = _a[_i];
                var options = fontList[font][0];
                var text = fontList[font][1] || "mmMwWLliI0fiflO&1";
                var span = document.createElement("span");
                span.textContent = text;
                span.style.whiteSpace = "nowrap";
                for (var _b = 0, _c = Object.keys(options); _b < _c.length; _b++) {
                  var option = _c[_b];
                  var value = options[option];
                  if (value !== undefined) {
                    span.style[option] = value;
                  }
                }
                elements[font] = span;
                parent.appendChild(document.createElement("br"));
                parent.appendChild(span);
              }
              for (var _d = 0, _e = Object.keys(fontList); _d < _e.length; _d++) {
                var font = _e[_d];
                sizes[font] = elements[font].getBoundingClientRect().width;
              }
              return sizes;
            }(doc, body);
          }, "<!doctype html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
        },
        audio: function () {
          var context = window;
          var OfflineAudioContext = context.OfflineAudioContext || context.webkitOfflineAudioContext;
          if (!OfflineAudioContext) {
            return -2;
          }
          if (isFirefox() && !isMobile() && !isTablet()) {
            return -1;
          }
          var audioContext = new OfflineAudioContext(1, 5000, 44100);
          var oscillator = audioContext.createOscillator();
          oscillator.type = "triangle";
          oscillator.frequency.value = 10000;
          var compressor = audioContext.createDynamicsCompressor();
          compressor.threshold.value = -50;
          compressor.knee.value = 40;
          compressor.ratio.value = 12;
          compressor.attack.value = 0;
          compressor.release.value = 0.25;
          oscillator.connect(compressor);
          compressor.connect(audioContext.destination);
          oscillator.start(0);
          var renderPromise = startRendering(audioContext);
          var fingerprintPromise = renderPromise.then(function (buffer) {
            return getFingerprint(buffer.getChannelData(0).subarray(4500));
          }, function (error) {
            if (error.name === "timeout" || error.name === "suspended") {
              return -3;
            }
            throw error;
          });
          return function () {
            renderPromise.catch(function () {});
            return fingerprintPromise;
          };
        },
        screenFrame: function() {
          var self = this;
          var getScreenFrame = function() {
            var context = this;
            (function() {
              if (frameRequestTimeout === undefined) {
                function requestFrame() {
                  var currentScreenFrame = getCurrentScreenFrame();
                  if (isFrameEmpty(currentScreenFrame)) {
                    frameRequestTimeout = setTimeout(requestFrame, 2500);
                  } else {
                    lastNonEmptyFrame = currentScreenFrame;
                    frameRequestTimeout = undefined;
                  }
                }
                requestFrame();
              }
            })();
            return function() {
              return __awaiter(context, void 0, void 0, function() {
                var frame;
                return __generator(this, function(step) {
                  switch (step.label) {
                    case 0:
                      if (isFrameEmpty(frame = getCurrentScreenFrame())) {
                        if (lastNonEmptyFrame) {
                          return [2, __spreadArray([], lastNonEmptyFrame, true)];
                        } else if ((document).fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
                          return [4, waitForFullscreenChange()];
                        } else {
                          return [3, 2];
                        }
                      } else {
                        return [3, 2];
                      }
                    case 1:
                      step.sent();
                      frame = getCurrentScreenFrame();
                      step.label = 2;
                    case 2:
                      if (!isFrameEmpty(frame)) {
                        lastNonEmptyFrame = frame;
                      }
                      return [2, frame];
                  }
                });
              });
            };
          }();
          return function() {
            return __awaiter(self, void 0, void 0, function() {
              var frame;
              var roundedFrame;
              return __generator(this, function(step) {
                switch (step.label) {
                  case 0:
                    return [4, getScreenFrame()];
                  case 1:
                    frame = step.sent();
                    return [2, [(roundedFrame = function(value) {
                      if (value === null) {
                        return null;
                      } else {
                        return roundToNearestPowerOfTwo(value, 10);
                      }
                    })(frame[0]), roundedFrame(frame[1]), roundedFrame(frame[2]), roundedFrame(frame[3])]];
                }
              });
            });
          };
        },
        osCpu: function() {
          return navigator.oscpu;
        },
        languages: function() {
          var navigator = window.navigator;
          var languageList = [];
          var primaryLanguage = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
          if (primaryLanguage !== undefined) {
            languageList.push([primaryLanguage]);
          }
          if (Array.isArray(navigator.languages)) {
            if (!isChromium() || !(getApproximateLanguageScore([!("MediaSettingsRange" in window), "RTCEncodedAudioFrame" in window, "" + window.Intl == "[object Intl]", "" + window.Reflect == "[object Reflect]"]) >= 3)) {
              languageList.push(navigator.languages);
            }
          } else if (typeof navigator.languages == "string") {
            var languages = navigator.languages;
            if (languages) {
              languageList.push(languages.split(","));
            }
          }
          return languageList;
        },
        colorDepth: function() {
          return window.screen.colorDepth;
        },
        deviceMemory: function() {
          return getValueOrUndefined(parseFloat(navigator.deviceMemory), undefined);
        },
        screenResolution: function() {
          var screen = window.screen;
          function getScreenDimension(dimension) {
            return getValueOrNull(parseInteger(dimension), null);
          }
          var dimensions = [getScreenDimension(screen.width), getScreenDimension(screen.height)];
          dimensions.sort().reverse();
          return dimensions;
        },
        hardwareConcurrency: function() {
          return getValueOrUndefined(parseInteger(navigator.hardwareConcurrency), undefined);
        },
        timezone: function() {
          var intlDateTimeFormat = window.Intl?.DateTimeFormat;
          if (intlDateTimeFormat) {
            var timeZone = new intlDateTimeFormat().resolvedOptions().timeZone;
            if (timeZone) {
              return timeZone;
            }
          }
          var currentYear = new Date().getFullYear();
          var januaryOffset = -Math.max(parseFloat(new Date(currentYear, 0, 1).getTimezoneOffset()), parseFloat(new Date(currentYear, 6, 1).getTimezoneOffset()));
          return `UTC${januaryOffset >= 0 ? "+" : ""}${Math.abs(januaryOffset)}`;
        },
        sessionStorage: function() {
          try {
            return !!window.sessionStorage;
          } catch (error) {
            return true;
          }
        },
        localStorage: function() {
          try {
            return !!window.localStorage;
          } catch (error) {
            return true;
          }
        },
        indexedDB: function() {
          if (!isIE() && !(getApproximateIEScore(["msWriteProfilerMark" in window, "MSStream" in window, "msLaunchUri" in navigator, "msSaveBlob" in navigator]) >= 3 && !isIE())) {
            try {
              return !!window.indexedDB;
            } catch (error) {
              return true;
            }
          }
        },
        openDatabase: function() {
          return !!window.openDatabase;
        },
        cpuClass: function() {
          return navigator.cpuClass;
        },
        platform: function() {
          var platform = navigator.platform;
          if (platform === "MacIntel" && isMacOS() && !isDesktop()) {
            if (isIPad()) {
              return "iPad";
            } else {
              return "iPhone";
            }
          } else {
            return platform;
          }
        },
        plugins: function() {
          var plugins = navigator.plugins;
          if (plugins) {
            var pluginList = [];
            for (var i = 0; i < plugins.length; ++i) {
              var plugin = plugins[i];
              if (plugin) {
                var mimeTypes = [];
                for (var j = 0; j < plugin.length; ++j) {
                  var mimeType = plugin[j];
                  var mimeTypeInfo = {
                    type: mimeType.type,
                    suffixes: mimeType.suffixes
                  };
                  mimeTypes.push(mimeTypeInfo);
                }
                var pluginInfo = {
                  name: plugin.name,
                  description: plugin.description,
                  mimeTypes: mimeTypes
                };
                pluginList.push(pluginInfo);
              }
            }
            return pluginList;
          }
        },
        canvas: function() {
          var geometryImage;
          var textImage;
          var isPointInPath = false;
          var canvasAndContext = createCanvasAndContext();
          var canvas = canvasAndContext[0];
          var context = canvasAndContext[1];
          if (isCanvasSupported(canvas, context)) {
            isPointInPath = checkPointInPath(context);
            drawCanvas(canvas, context);
            var firstImageData = getCanvasImageData(canvas);
            if (firstImageData !== getCanvasImageData(canvas)) {
              geometryImage = textImage = "unstable";
            } else {
              textImage = firstImageData;
              drawCanvasGeometry(canvas, context);
              geometryImage = getCanvasImageData(canvas);
            }
          } else {
            geometryImage = textImage = "";
          }
          var canvasInfo = {
            winding: isPointInPath,
            geometry: geometryImage,
            text: textImage
          };
          return canvasInfo;
        },
        touchSupport: function() {
          var maxTouchPoints;
          var navigator = window.navigator;
          var touchPoints = 0;
          if (navigator.maxTouchPoints !== undefined) {
            touchPoints = parseInteger(navigator.maxTouchPoints);
          } else if (navigator.msMaxTouchPoints !== undefined) {
            touchPoints = navigator.msMaxTouchPoints;
          }
          try {
            document.createEvent("TouchEvent");
            maxTouchPoints = true;
          } catch (error) {
            maxTouchPoints = false;
          }
          var touchSupport = {
            maxTouchPoints: touchPoints,
            touchEvent: maxTouchPoints,
            touchStart: "ontouchstart" in window
          };
          return touchSupport;
        },
        vendor: function() {
          return navigator.vendor || "";
        },
        vendorFlavors: function() {
          var flavors = [];
          for (var i = 0, vendorPrefixes = ["chrome", "safari", "__crWeb", "__gCrWeb", "yandex", "__yb", "__ybro", "__firefox__", "__edgeTrackingPreventionStatistics", "webkit", "oprt", "samsungAr", "ucweb", "UCShellJava", "puffinDevice"]; i < vendorPrefixes.length; i++) {
            var prefix = vendorPrefixes[i];
            var prefixObj = window[prefix];
            if (prefixObj && typeof prefixObj == "object") {
              flavors.push(prefix);
            }
          }
          return flavors.sort();
        },
        cookiesEnabled: function() {
          var document = window.document;
          try {
            document.cookie = "cookietest=1; SameSite=Strict;";
            var cookiesEnabled = document.cookie.indexOf("cookietest=") !== -1;
            document.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT";
            return cookiesEnabled;
          } catch (error) {
            return false;
          }
        },
        colorGamut: function() {
          for (var i = 0, gamuts = ["rec2020", "p3", "srgb"]; i < gamuts.length; i++) {
            var gamut = gamuts[i];
            if (matchMedia(`(color-gamut: ${gamut})`).matches) {
              return gamut;
            }
          }
        },
        invertedColors: function() {
          return !!matchMedia("inverted-colors: inverted").matches || !matchMedia("inverted-colors: none").matches && undefined;
        },
        forcedColors: function() {
          return !!matchMedia("forced-colors: active").matches || !matchMedia("forced-colors: none").matches && undefined;
        },
        monochrome: function() {
          if (matchMedia("(min-monochrome: 0)").matches) {
            for (var i = 0; i <= 100; ++i) {
              if (matchMedia(`(max-monochrome: ${i})`).matches) {
                return i;
              }
            }
            throw new Error("Too high value");
          }
        },
        contrast: function() {
          if (matchMedia("(prefers-contrast: no-preference)").matches) {
            return 0;
          } else if (matchMedia("(prefers-contrast: high)").matches || matchMedia("(prefers-contrast: more)").matches) {
            return 1;
          } else if (matchMedia("(prefers-contrast: low)").matches || matchMedia("(prefers-contrast: less)").matches) {
            return -1;
          } else if (matchMedia("(prefers-contrast: forced)").matches) {
            return 10;
          } else {
            return undefined;
          }
        },
        reducedMotion: function() {
          return !!matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(prefers-reduced-motion: no-preference)").matches && undefined;
        },
        hdr: function() {
          return !!matchMedia("(dynamic-range: high)").matches || !matchMedia("(dynamic-range: standard)").matches && undefined;
        },
        math: function() {
          var acos = Math.acos || fallbackFunc;
          var acosh = Math.acosh || fallbackFunc;
          var asin = Math.asin || fallbackFunc;
          var asinh = Math.asinh || fallbackFunc;
          var atanh = Math.atanh || fallbackFunc;
          var atan = Math.atan || fallbackFunc;
          var sin = Math.sin || fallbackFunc;
          var sinh = Math.sinh || fallbackFunc;
          var cos = Math.cos || fallbackFunc;
          var cosh = Math.cosh || fallbackFunc;
          var tan = Math.tan || fallbackFunc;
          var tanh = Math.tanh || fallbackFunc;
          var exp = Math.exp || fallbackFunc;
          var expm1 = Math.expm1 || fallbackFunc;
          var log1p = Math.log1p || fallbackFunc;
          return {
            acos: acos(0.12312423423423424),
            acosh: acosh(1e+308),
            acoshPf: Math.log(1e+154 + Math.sqrt(1e+154 * 1e+154 - 1)),
            asin: asin(0.12312423423423424),
            asinh: asinh(1),
            asinhPf: Math.log(1 + Math.sqrt(2)),
            atanh: atanh(0.5),
            atanhPf: Math.log(3) / 2,
            atan: atan(0.5),
            sin: sin(-1e+300),
            sinh: sinh(1),
            sinhPf: Math.exp(1) - 1 / Math.exp(1) / 2,
            cos: cos(10.000000000123),
            cosh: cosh(1),
            coshPf: (Math.exp(1) + 1 / Math.exp(1)) / 2,
            tan: tan(-1e+300),
            tanh: tanh(1),
            tanhPf: (Math.exp(2) - 1) / (Math.exp(2) + 1),
            exp: exp(1),
            expm1: expm1(1),
            expm1Pf: Math.exp(1) - 1,
            log1p: log1p(10),
            log1pPf: Math.log(11),
            powPI: Math.pow(Math.PI, -100)
          };
        },
        videoCard: function() {
          var canvas = document.createElement("canvas");
          var gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
          if (gl && "getExtension" in gl) {
            var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugInfo) {
              return {
                vendor: (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "").toString(),
                renderer: (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "").toString()
              };
            }
          }
        },
        pdfViewerEnabled: function() {
          return navigator.pdfViewerEnabled;
        },
        architecture: function() {
          var float32Array = new Float32Array(1);
          var uint8Array = new Uint8Array(float32Array.buffer);
          float32Array[0] = Infinity;
          float32Array[0] = float32Array[0] - float32Array[0];
          return uint8Array[3];
        }
        };
        /**
         * Calculates the confidence score based on the provided components.
         * @param {Array} components - An array of component objects.
         * @returns {number} The average confidence score of valid components.
         */
        function getConfidenceScore(components) {
          var confidenceScore = function(components) {
            if (components.length === 0) {
              return 0;
            }
            
            var totalScore = 0;
            var validComponentsCount = 0;
            
            for (var i = 0; i < components.length; i++) {
              var component = components[i];
              if (component.error) {
                continue;
              }
              totalScore += component.confidence;
              validComponentsCount++;
            }
            
            if (validComponentsCount === 0) {
              return 0;
            }
            
            return totalScore / validComponentsCount;
          };
          
          return confidenceScore(components);
        }

        function stringifyError(obj) {
          return JSON.stringify(obj, function (key, value) {
            if (value instanceof Error) {
              return {
                name: value.name,
                message: value.message,
                stack: value.stack ? value.stack.split("\n") : undefined
              };
            }
            return value;
          }, 2);
        }

        /**
         * Generates a hash using the MurmurHash3 algorithm.
         * @param {string} input - The input string to hash.
         * @param {number} [seed=0] - The seed for the hash function (optional, default is 0).
         * @returns {string} The generated 128-bit hash as a 32-character hexadecimal string.
         */
        function generateHash(input, seed) {
          seed = seed || 0;
          var remainingLength = input.length % 16;
          var mainLength = input.length - remainingLength;
          var h1 = [0, seed];
          var h2 = [0, seed];
          var k1 = [0, 0];
          var k2 = [0, 0];
          var c1 = [2277735313, 289559509];
          var c2 = [1291169091, 658871167];

          // Process the input in 16-byte chunks
          for (var i = 0; i < mainLength; i += 16) {
            // Load 16 bytes into k1 and k2
            k1 = [
              input.charCodeAt(i + 4) & 255 | (input.charCodeAt(i + 5) & 255) << 8 | (input.charCodeAt(i + 6) & 255) << 16 | (input.charCodeAt(i + 7) & 255) << 24,
              input.charCodeAt(i) & 255 | (input.charCodeAt(i + 1) & 255) << 8 | (input.charCodeAt(i + 2) & 255) << 16 | (input.charCodeAt(i + 3) & 255) << 24
            ];
            k2 = [
              input.charCodeAt(i + 12) & 255 | (input.charCodeAt(i + 13) & 255) << 8 | (input.charCodeAt(i + 14) & 255) << 16 | (input.charCodeAt(i + 15) & 255) << 24,
              input.charCodeAt(i + 8) & 255 | (input.charCodeAt(i + 9) & 255) << 8 | (input.charCodeAt(i + 10) & 255) << 16 | (input.charCodeAt(i + 11) & 255) << 24
            ];

            // Mix k1 into h1
            k1 = multiplyNumbers(k1, c1);
            k1 = rotateLeft(k1, 31);
            k1 = multiplyNumbers(k1, c2);
            h1 = xorNumbers(h1, k1);

            h1 = rotateLeft(h1, 27);
            h1 = addNumbers(h1, h2);
            h1 = addNumbers(multiplyNumbers(h1, [0, 5]), [0, 1390208809]);

            // Mix k2 into h2
            k2 = multiplyNumbers(k2, c2);
            k2 = rotateLeft(k2, 33);
            k2 = multiplyNumbers(k2, c1);
            h2 = xorNumbers(h2, k2);

            h2 = rotateLeft(h2, 31);
            h2 = addNumbers(h2, h1);
            h2 = addNumbers(multiplyNumbers(h2, [0, 5]), [0, 944331445]);
          }

          // Process any remaining bytes
          k1 = [0, 0];
          k2 = [0, 0];

          switch (remainingLength) {
            case 15:
              k2 = xorNumbers(k2, leftShift([0, input.charCodeAt(i + 14)], 48));
            case 14:
              k2 = xorNumbers(k2, leftShift([0, input.charCodeAt(i + 13)], 40));
            case 13:
              k2 = xorNumbers(k2, leftShift([0, input.charCodeAt(i + 12)], 32));
            case 12:
              k2 = xorNumbers(k2, leftShift([0, input.charCodeAt(i + 11)], 24));
            case 11:
              k2 = xorNumbers(k2, leftShift([0, input.charCodeAt(i + 10)], 16));
            case 10:
              k2 = xorNumbers(k2, leftShift([0, input.charCodeAt(i + 9)], 8));
            case 9:
              k2 = xorNumbers(k2, [0, input.charCodeAt(i + 8)]);
              k2 = multiplyNumbers(k2, c2);
              k2 = rotateLeft(k2, 33);
              k2 = multiplyNumbers(k2, c1);
              h2 = xorNumbers(h2, k2);
            case 8:
              k1 = xorNumbers(k1, leftShift([0, input.charCodeAt(i + 7)], 56));
            case 7:
              k1 = xorNumbers(k1, leftShift([0, input.charCodeAt(i + 6)], 48));
            case 6:
              k1 = xorNumbers(k1, leftShift([0, input.charCodeAt(i + 5)], 40));
            case 5:
              k1 = xorNumbers(k1, leftShift([0, input.charCodeAt(i + 4)], 32));
            case 4:
              k1 = xorNumbers(k1, leftShift([0, input.charCodeAt(i + 3)], 24));
            case 3:
              k1 = xorNumbers(k1, leftShift([0, input.charCodeAt(i + 2)], 16));
            case 2:
              k1 = xorNumbers(k1, leftShift([0, input.charCodeAt(i + 1)], 8));
            case 1:
              k1 = xorNumbers(k1, [0, input.charCodeAt(i)]);
              k1 = multiplyNumbers(k1, c1);
              k1 = rotateLeft(k1, 31);
              k1 = multiplyNumbers(k1, c2);
              h1 = xorNumbers(h1, k1);
          }

          // Finalization
          h1 = xorNumbers(h1, [0, input.length]);
          h2 = xorNumbers(h2, [0, input.length]);

          h1 = addNumbers(h1, h2);
          h2 = addNumbers(h2, h1);

          h1 = fmix(h1);
          h2 = fmix(h2);

          h1 = addNumbers(h1, h2);
          h2 = addNumbers(h2, h1);

          // Convert the result to a 32-character hexadecimal string
          return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) +
                 ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) +
                 ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) +
                 ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
        }

        // Function to generate a visitor ID based on provided components
        function generateVisitorId(components) {
          var result = "";
          var sortedKeys = Object.keys(components).sort();
          
          // Iterate through sorted keys of components
          for (var i = 0; i < sortedKeys.length; i++) {
            var key = sortedKeys[i];
            var component = components[key];
            // Use "error" if component has an error, otherwise stringify the value
            var value = component.error ? "error" : JSON.stringify(component.value);
            // Build the result string, escaping special characters in the key
            result += (result ? "|" : "") + key.replace(/([:|\\])/g, "\\$1") + ":" + value;
          }
          
          return generateHash(result);
        }

        function requestIdleCallback(timeout = 50) {
          var maxTimeout = timeout * 2;
          
          if (window.requestIdleCallback) {
            return new Promise(function (resolve) {
              var options = {
                timeout: maxTimeout
              };
              return window.requestIdleCallback.call(window, function () {
                return resolve();
              }, options);
            });
          } else {
            return new Promise(function (resolve) {
              setTimeout(resolve, Math.min(timeout, maxTimeout));
            });
          }
        }

        function createVisitorIdGenerator(getComponents, debug) {
          var startTime = Date.now();
          
          return {
            get: async function (options) {
              var currentTime = Date.now();
              var components = await getComponents();
              var visitorData = {
                components: components,
                visitorId: generateVisitorId(components),
                confidence: getConfidenceScore(components),
                version: "1.0.0"
              };

              if (debug || (options && options.debug)) {
                console.log(`Copy the text below to get the debug data:

\`\`\`
version: ${visitorData.version}
userAgent: ${navigator.userAgent}
timeBetweenLoadAndGet: ${currentTime - startTime}
visitorId: ${visitorData.visitorId}
components: ${stringifyError(components)}
\`\`\``);
              }

              return visitorData;
            }
          };
        }
      var fingerprint = {
        load: function (options) {
          var config = options === undefined ? {} : options;
          var delayFallback = config.delayFallback;
          var debug = config.debug;
          var monitoring = config.monitoring;
          var enableMonitoring = monitoring === undefined || monitoring;
          return asyncFunction(this, undefined, undefined, function () {
            var getComponents;
            return asyncGenerator(this, function (step) {
              switch (step.label) {
                case 0:
                  if (enableMonitoring) {
                    (function () {
                      if (!window.__fpjs_d_m && !(Math.random() >= 0.001)) {
                        try {
                          var request = new XMLHttpRequest();
                          request.open("get", `https://m1.openfpcdn.io/fingerprintjs/v${version}/npm-monitoring`, true);
                          request.send();
                        } catch (error) {
                          console.error(error);
                        }
                      }
                    })();
                  }
                  return [4, delay(delayFallback)];
                case 1:
                  step.sent();
                  getComponents = function (options) {
                    return function (sources, options, excludedComponents) {
                      var includedComponents = Object.keys(sources).filter(function (component) {
                        return !isExcluded(excludedComponents, component);
                      });
                      var componentPromises = mapComponents(includedComponents, function (component) {
                        return function (source, options) {
                          var promise = new Promise(function (resolve) {
                            var startTime = Date.now();
                            executeAsync(source.bind(null, options), function () {
                              var args = [];
                              for (var i = 0; i < arguments.length; i++) {
                                args[i] = arguments[i];
                              }
                              var duration = Date.now() - startTime;
                              if (!args[0]) {
                                return resolve(function () {
                                  return {
                                    error: formatError(args[1]),
                                    duration: duration
                                  };
                                });
                              }
                              var result = args[1];
                              if (isPromise(result)) {
                                return resolve(function () {
                                  var componentData = {
                                    value: result,
                                    duration: duration
                                  };
                                  return componentData;
                                });
                              }
                              resolve(function () {
                                return new Promise(function (resolveInner) {
                                  var innerStartTime = Date.now();
                                  executeAsync(result, function () {
                                    var innerArgs = [];
                                    for (var j = 0; j < arguments.length; j++) {
                                      innerArgs[j] = arguments[j];
                                    }
                                    var totalDuration = duration + Date.now() - innerStartTime;
                                    if (!innerArgs[0]) {
                                      return resolveInner({
                                        error: formatError(innerArgs[1]),
                                        duration: totalDuration
                                      });
                                    }
                                    var componentData = {
                                      value: innerArgs[1],
                                      duration: totalDuration
                                    };
                                    resolveInner(componentData);
                                  });
                                });
                              });
                            });
                          });
                          handlePromise(promise);
                          return function () {
                            return promise.then(function (result) {
                              return result();
                            });
                          };
                        }(sources[component], options);
                      });
                      handlePromise(componentPromises);
                      return function () {
                        return asyncFunction(this, undefined, undefined, function () {
                          var resolvedPromises;
                          var componentResults;
                          var finalComponents;
                          var index;
                          return asyncGenerator(this, function (step) {
                            switch (step.label) {
                              case 0:
                                return [4, componentPromises];
                              case 1:
                                return [4, mapComponents(step.sent(), function (componentPromise) {
                                  var result = componentPromise();
                                  handlePromise(result);
                                  return result;
                                })];
                              case 2:
                                resolvedPromises = step.sent();
                                return [4, Promise.all(resolvedPromises)];
                              case 3:
                                componentResults = step.sent();
                                finalComponents = {};
                                index = 0;
                                for (; index < includedComponents.length; ++index) {
                                  finalComponents[includedComponents[index]] = componentResults[index];
                                }
                                return [2, finalComponents];
                            }
                          });
                        });
                      };
                    }(componentSources, options, []);
                  }({
                    debug: debug
                  });
                  return [2, createVisitorIdGenerator(getComponents, debug)];
              }
            });
          });
        },
        hashComponents: hashComponentValues,
        componentsToDebugString: formatComponentsForDebug
      };
      // This function generates a fingerprint for the user's device
      var getFingerprint = function () {
        // Asynchronous function to get the fingerprint
        var getFingerprintAsync = asyncFunction(asyncGenerator().mark(function getFingerprint() {
          var fpAgent;
          var fpData;
          return asyncGenerator().wrap(function (step) {
            while (true) {
              switch (step.prev = step.next) {
                case 0:
                  step.prev = 0;
                  step.next = 3;
                  // Load the fingerprint library
                  return fingerprint.load({
                    monitoring: false
                  });
                case 3:
                  fpAgent = step.sent;
                  step.next = 6;
                  // Get the fingerprint data
                  return fpAgent.get();
                case 6:
                  fpData = step.sent;
                  // Return an object containing fingerprint information
                  return step.abrupt("return", {
                    version: fpData.version,
                    visitor_id: fpData.visitorId,
                    confidence: fpData.confidence.score,
                    hashes: {
                      // Hash various components of the fingerprint
                      fonts: fingerprint.hashComponents({
                        fonts: fpData.components.fonts,
                        fontPreferences: fpData.components.fontPreferences
                      }),
                      plugins: fingerprint.hashComponents({
                        plugins: fpData.components.plugins
                      }),
                      audio: fingerprint.hashComponents({
                        audio: fpData.components.audio
                      }),
                      canvas: fingerprint.hashComponents({
                        canvas: fpData.components.canvas
                      }),
                      screen: fingerprint.hashComponents({
                        screenFrame: fpData.components.screenFrame,
                        colorDepth: fpData.components.colorDepth,
                        screenResolution: fpData.components.screenResolution,
                        touchSupport: fpData.components.touchSupport,
                        invertedColors: fpData.components.invertedColors,
                        forcedColors: fpData.components.forcedColors,
                        monochrome: fpData.components.monochrome,
                        contrast: fpData.components.contrast,
                        reducedMotion: fpData.components.reducedMotion,
                        hdr: fpData.components.hdr
                      })
                    }
                  });
                case 10:
                  step.prev = 10;
                  step.t0 = step.catch(0);
                  // Log any errors that occur during the fingerprinting process
                  logError(talon.env, errorCode, talon.session, step.t0.message, step.t0.stack);
                case 13:
                case "end":
                  return step.stop();
              }
            }
          }, getFingerprint, null, [[0, 10]]);
        }));
        // Return a function that calls the asynchronous fingerprint getter
        return function () {
          return getFingerprintAsync.apply(this, arguments);
        };
      }();
      var eventThrottles = {
        mousemove: new Throttle(500, 50),
        mousedown: new Throttle(50),
        mouseup: new Throttle(50),
        wheel: new Throttle(100, 50),
        touchstart: new Throttle(50),
        touchend: new Throttle(50),
        touchmove: new Throttle(500, 50),
        scroll: new Throttle(50),
        keydown: new Throttle(50),
        keyup: new Throttle(50),
        resize: new Throttle(50),
        paste: new Throttle(50)
      };
      function getEventCounts() {
        var counts = {};
        Object.keys(eventThrottles).forEach(function (eventType) {
          counts[eventType] = eventThrottles[eventType].peek();
        });
        return counts;
      }
      var checkWebAssemblySupport = function () {
        var checkWebAssemblySupportAsync = asyncFunction(asyncGenerator().mark(function checkSupport() {
          var wasmBinary;
          var wasmModule;
          var wasmInstance;
          return asyncGenerator().wrap(function (step) {
            while (true) {
              switch (step.prev = step.next) {
                case 0:
                  step.prev = 0;
                  if ((typeof WebAssembly == "undefined" ? "undefined" : typeof WebAssembly) === "object" && typeof WebAssembly.instantiate == "function") {
                    step.next = 3;
                    break;
                  }
                  return step.abrupt("return", false);
                case 3:
                  wasmBinary = Uint8Array.from(window.atob("AGFzbQEAAAA="), function (char) {
                    return char.charCodeAt(0);
                  });
                  if ((wasmModule = new WebAssembly.Module(wasmBinary)) instanceof WebAssembly.Module) {
                    step.next = 7;
                    break;
                  }
                  return step.abrupt("return", false);
                case 7:
                  step.next = 9;
                  return WebAssembly.instantiate(wasmModule);
                case 9:
                  wasmInstance = step.sent;
                  return step.abrupt("return", wasmInstance instanceof WebAssembly.Instance);
                case 13:
                  step.prev = 13;
                  step.t0 = step.catch(0);
                  logError(talon.env, errorCode, talon.session, step.t0.message, step.t0.stack);
                case 16:
                  return step.abrupt("return", false);
                case 17:
                case "end":
                  return step.stop();
              }
            }
          }, checkSupport, null, [[0, 13]]);
        }));
        return function () {
          return checkWebAssemblySupportAsync.apply(this, arguments);
        };
      }();
      function getCallerInfo() {
        var callerInfo = {
          caller_stack_trace: talon.entry
        };
        return callerInfo;
      }
      function getObjectKeys(obj, enumOnly) {
        var keys = Object.keys(obj);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(obj);
          if (enumOnly) {
            symbols = symbols.filter(function (sym) {
              return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
            });
          }
          keys.push.apply(keys, symbols);
        }
        return keys;
      }
      /**
       * Merges multiple objects into a target object.
       * @param {Object} target - The target object to merge into.
       * @param {...Object} sources - The source objects to merge from.
       * @returns {Object} The merged target object.
       */
      function mergeObjects(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] ?? {};
          if (i % 2) {
            // For odd-indexed arguments, merge enumerable properties
            getObjectKeys(Object(source), true).forEach(function (key) {
              defineProperty(target, key, source[key]);
            });
          } else if (Object.getOwnPropertyDescriptors) {
            // For even-indexed arguments, use Object.defineProperties if available
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
          } else {
            // Fallback for environments without Object.getOwnPropertyDescriptors
            getObjectKeys(Object(source)).forEach(function (key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
          }
        }
        return target;
      }
      function arraySlice(arr, len) {
        if (len == null || len > arr.length) {
          len = arr.length;
        }
        var result = new Array(len);
        for (var i = 0; i < len; i++) {
          result[i] = arr[i];
        }
        return result;
      }
      // Encryption key used for token generation
      var encryptionKey = "FZMÃ›SÃª/Â·V«xÞhí¢³4<`ô2ª,µ¦YÃ»";
      // Unique identifier for the key
      var keyId = "aRAejw";
      /**
       * Generates a token based on the provided data and solve token
       * @param {Object} data - The data to be included in the token
       * @param {string} solveToken - The solve token used in the generation process
       * @returns {string} The generated token
       */
      function generateToken(data, solveToken) {
        return tokenGenerator.apply(this, arguments);
      }
      /**
       * Generates a token based on the provided data and solve token.
       * 
       * This function uses an asynchronous generator to create a token. It merges
       * environment data, input data, and a solve token object. The resulting token
       * includes encrypted data, a version number, and a key ID.
       * 
       * @param {Object} data - The input data to be included in the token.
       * @param {string} solveToken - The solve token to be included in the token.
       * @returns {Promise<Object>} A promise that resolves to an object containing the generated token.
       * @throws {Error} If an error occurs during token generation, it's logged using the logError function.
       */
      function tokenGenerator() {
        return (tokenGenerator = asyncFunction(asyncGenerator().mark(function tokenGen(data, solveToken) {
          var result;
          var tokenData;
          return asyncGenerator().wrap(function (step) {
            while (true) {
              switch (step.prev = step.next) {
                case 0:
                  step.prev = 0;
                  step.t0 = mergeObjects;
                  step.t1 = mergeObjects;
                  step.t2 = mergeObjects;
                  step.t3 = {};
                  step.next = 7;
                  return getEnvironmentData();
                case 7:
                  var solveTokenObj = {
                    solve_token: solveToken
                  };
                  step.t4 = step.sent;
                  step.t5 = (0, step.t2)(step.t3, step.t4);
                  step.t6 = data;
                  step.t7 = (0, step.t1)(step.t5, step.t6);
                  step.t8 = {};
                  step.t9 = solveTokenObj;
                  tokenData = (0, step.t0)(step.t7, step.t8, step.t9);
                  return step.abrupt("return", (defineProperty(result = {
                    v: 1
                  }, "xal", encryptToken(tokenData)), defineProperty(result, "ewa", "b"), defineProperty(result, "kid", keyId), result));
                case 17:
                  step.prev = 17;
                  step.t10 = step.catch(0);
                  logError(talon.env, errorCode, talon.session, step.t10.message, step.t10.stack);
                case 20:
                case "end":
                  return step.stop();
              }
            }
          }, tokenGen, null, [[0, 17]]);
        }))).apply(this, arguments);
      }
      /**
       * Encrypts the given data using a custom encryption algorithm.
       * 
       * This function implements a variant of the RC4 stream cipher:
       * 1. It first converts the input data to a JSON string and encodes it.
       * 2. It initializes an S-box (substitution box) with 256 elements.
       * 3. It performs a key scheduling algorithm using the encryptionKey.
       * 4. It then generates a keystream and XORs it with the input data.
       * 5. Finally, it base64 encodes the result.
       * 
       * @param {Object} data - The data to be encrypted.
       * @returns {string} The encrypted data as a base64 encoded string.
       */
      function encryptToken(data) {
        var temp;
        var jsonString = unescape(encodeURIComponent(JSON.stringify(data)));
        var sBox = [];
        var j = 0;
        var result = "";
        for (var i = 0; i < 256; i++) {
          sBox[i] = i;
        }
        for (var i = 0; i < 256; i++) {
          j = (j + sBox[i] + encryptionKey.charCodeAt(i % encryptionKey.length)) % 256;
          temp = sBox[i];
          sBox[i] = sBox[j];
          sBox[j] = temp;
        }
        var i = 0;
        j = 0;
        for (var k = 0; k < jsonString.length; k++) {
          j = (j + sBox[i = (i + 1) % 256]) % 256;
          temp = sBox[i];
          sBox[i] = sBox[j];
          sBox[j] = temp;
          result += String.fromCharCode(jsonString.charCodeAt(k) ^ sBox[(sBox[i] + sBox[j]) % 256]);
        }
        return window.btoa(result);
      }
      /**
       * Calculates a hash value for the given data using the FNV-1a algorithm.
       * 
       * This function implements the 32-bit version of the FNV-1a (Fowler/Noll/Vo) hash algorithm:
       * 1. It starts with an initial hash value (FNV offset basis).
       * 2. For each byte in the input:
       *    a. XOR the hash with the byte.
       *    b. Multiply the result by the FNV prime.
       * 3. The hash is maintained as a 32-bit unsigned integer.
       * 
       * The function processes each property of the input data recursively.
       * 
       * @param {*} data - The data to be hashed. Can be of any type.
       * @returns {number} The calculated hash value.
       */
      function calculateHash(data) {
        var item;
        var hash = 2166136261;  // FNV offset basis for 32-bit version
        function updateHash(value) {
          var str = `${JSON.stringify(value)};`;
          for (var i = 0; i < str.length; i++) {
            hash = (hash ^ str.charCodeAt(i)) & 4294967295;  // XOR and limit to 32 bits
            hash = Math.imul(hash, 16777619);  // Multiply by FNV prime for 32-bit version
          }
          return value;
        }
        var iterator = function (iterable, maxLen) {
          var iteratorFn = typeof Symbol != "undefined" && iterable[Symbol.iterator] || iterable["@@iterator"];
          if (!iteratorFn) {
            if (Array.isArray(iterable) || (iteratorFn = function (obj, len) {
              if (obj) {
                if (typeof obj == "string") {
                  return arraySlice(obj, len);
                }
                var type = Object.prototype.toString.call(obj).slice(8, -1);
                if (type === "Object" && obj.constructor) {
                  type = obj.constructor.name;
                }
                if (type === "Map" || type === "Set") {
                  return Array.from(obj);
                } else if (type === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(type)) {
                  return arraySlice(obj, len);
                } else {
                  return undefined;
                }
              }
            }(iterable)) || maxLen && iterable && typeof iterable.length == "number") {
              if (iteratorFn) {
                iterable = iteratorFn;
              }
              var index = 0;
              function next() {}
              var iterator = {
                s: next,
                n: function () {
                  var done = {};
                  done.done = true;
                  if (index >= iterable.length) {
                    return done;
                  } else {
                    return {
                      done: false,
                      value: iterable[index++]
                    };
                  }
                },
                e: function (error) {
                  throw error;
                },
                f: next
              };
              return iterator;
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }
          var error;
          var normalCompletion = true;
          var didErr = false;
          return {
            s: function () {
              iteratorFn = iteratorFn.call(iterable);
            },
            n: function () {
              var step = iteratorFn.next();
              normalCompletion = step.done;
              return step;
            },
            e: function (err) {
              didErr = true;
              error = err;
            },
            f: function () {
              try {
                if (!normalCompletion && iteratorFn.return != null) {
                  iteratorFn.return();
                }
              } finally {
                if (didErr) {
                  throw error;
                }
              }
            }
          };
        }(data);
        try {
          for (iterator.s(); !(item = iterator.n()).done;) {
            updateHash(item.value);
          }
        } catch (err) {
          iterator.e(err);
        } finally {
          iterator.f();
        }
        return hash >>> 0;
      }
      function getEnvironmentData() {
        return getEnvData.apply(this, arguments);
      }
      // Function to get environment data asynchronously
      function getEnvironmentData() {
        return (getEnvironmentData = asyncToGenerator(regeneratorRuntime.mark(function asyncFunction() {
          var envData;
          var filteredKeys;
          var filteredValues;
          return regeneratorRuntime.wrap(function asyncFunctionStep(context) {
            while (true) {
              switch (context.prev = context.next) {
                case 0:
                  // Initialize environment data object
                  envData = {};
                  envData.fingerprint_version = 42;
                  envData.timestamp = getTimestamp();
                  envData.math_rand = getRandomNumber();
                  context.t0 = addProperty;
                  context.t1 = envData;
                  context.next = 8;
                  return checkWebAssembly();
                case 8:
                  context.t2 = context.sent;
                  (0, context.t0)(context.t1, "webasm", context.t2);
                  // Add various properties to envData
                  addProperty(envData, "document", getDocumentInfo());
                  addProperty(envData, "navigator", getNavigatorInfo());
                  addProperty(envData, "web_gl", getWebGLInfo());
                  context.t3 = addProperty;
                  context.t4 = envData;
                  context.next = 17;
                  return getWindowInfo();
                case 17:
                  context.t5 = context.sent;
                  (0, context.t3)(context.t4, "window", context.t5);
                  addProperty(envData, "date", getDateInfo());
                  addProperty(envData, "runtime", getRuntimeInfo());
                  context.t6 = addProperty;
                  context.t7 = envData;
                  context.next = 25;
                  return getFPJSInfo();
                case 25:
                  context.t8 = context.sent;
                  (0, context.t6)(context.t7, "fpjs", context.t8);
                  addProperty(envData, "motion", getMotionInfo());
                  addProperty(envData, "sdk", getSDKInfo());
                  // Add acid_boron property
                  addProperty(envData, "acid_boron", ((talon?.session?.session?.config?.acid) && (talon?.session?.session?.config?.acid.includes("boron"))));
                  // Filter specific keys
                  filteredKeys = ["timestamp", "math_rand", "document", "navigator", "web_gl", "window", "date", "runtime", "fpjs", "motion", "sdk"];
                  // Create filtered values array
                  filteredValues = Object.entries(envData).reduce(function (acc, [key, value]) {
                    if (filteredKeys.indexOf(key) !== -1) {
                      acc.push(value);
                    }
                    return acc;
                  }, []);
                  // Return envData with calculated hash
                  return context.abrupt("return", Object.assign({}, envData, {
                    s: calculateHash(filteredValues)
                  }));
                case 34:
                case "end":
                  return context.stop();
              }
            }
          }, asyncFunction);
        }))).apply(this, arguments);
      }
      // Translations for different languages
      var germanTranslations = {
        challengeTitle: "Ein letzter Schritt",
        challengeSubtitle: "Bitte führe eine Sicherheitskontrolle aus, um fortzufahren.",
        sessionID: "Sitzungs-ID",
        ipAddress: "IP-Adresse",
        errorTryAgain: "Bitte versuche es erneut.",
        tryAgainButton: "Erneut versuchen"
      };
      var englishTranslations = {
        challengeTitle: "One More Step",
        challengeSubtitle: "Please complete a security check to continue",
        sessionID: "Session ID",
        ipAddress: "IP Address",
        errorTryAgain: "Please try again",
        tryAgainButton: "Try Again"
      };
      var spanishTranslations = {
        challengeTitle: "Un paso más",
        challengeSubtitle: "Completa el control de seguridad para continuar",
        sessionID: "ID de sesión",
        ipAddress: "Dirección IP",
        errorTryAgain: "Inténtalo de nuevo.",
        tryAgainButton: "Intentar de nuevo"
      };
      var mexicanSpanishTranslations = {
        challengeTitle: "Un paso más",
        challengeSubtitle: "Completa el control de seguridad para continuar",
        sessionID: "ID de sesión",
        ipAddress: "Dirección IP",
        errorTryAgain: "Inténtalo de nuevo.",
        tryAgainButton: "Reintentar"
      };
      var frenchTranslations = {
        challengeTitle: "Encore une étape",
        challengeSubtitle: "Remplissez l'enquête de sécurité pour continuer",
        sessionID: "ID de session",
        ipAddress: "Adresse IP",
        errorTryAgain: "Veuillez réessayer.",
        tryAgainButton: "Réessayer"
      };
      var italianTranslations = {
        challengeTitle: "Ancora un passo da compiere",
        challengeSubtitle: "Completa un controllo di sicurezza per continuare",
        sessionID: "ID della sessione",
        ipAddress: "Indirizzo IP",
        errorTryAgain: "Ti preghiamo di ritentare",
        tryAgainButton: "Ritenta"
      };
      var japaneseTranslations = {
        challengeTitle: "あともう1ステップ",
        challengeSubtitle: "継続するにはセキュリティチェックを完了してください",
        sessionID: "セッションID",
        ipAddress: "IPアドレス",
        errorTryAgain: "もう一度お試しください",
        tryAgainButton: "もう一度試す"
      };
      var koreanTranslations = {
        challengeTitle: "한 단계가 더 남았습니다",
        challengeSubtitle: "계속하려면 보안 검사를 완료해주세요",
        sessionID: "세션 ID",
        ipAddress: "IP 주소",
        errorTryAgain: "다시 시도해주세요",
        tryAgainButton: "다시 시도"
      };
      var polishTranslations = {
        challengeTitle: "Jeszcze jeden krok",
        challengeSubtitle: "Przeprowadź kontrolę bezpieczeństwa, by kontynuować",
        sessionID: "Identyfikator sesji",
        ipAddress: "Adres IP",
        errorTryAgain: "Proszę spróbować ponownie.",
        tryAgainButton: "Spróbuj ponownie"
      };
      var portugueseTranslations = {
        challengeTitle: "Mais uma etapa",
        challengeSubtitle: "Complete uma verificação de segurança para continuar",
        sessionID: "ID da sessão",
        ipAddress: "Endereço IP",
        errorTryAgain: "Tente novamente",
        tryAgainButton: "Tentar novamente"
      };
      var russianTranslations = {
        challengeTitle: "Ещё один шаг",
        challengeSubtitle: "Перед тем как продолжить, завершите проверку безопасности",
        sessionID: "Идентификатор сеанса",
        ipAddress: "IP-адрес",
        errorTryAgain: "Повторите попытку.",
        tryAgainButton: "Повторить попытку"
      };
      var chineseSimplifiedTranslations = {
        challengeTitle: "再进行一步操作",
        challengeSubtitle: "请完成安全检查以继续",
        sessionID: "会话 ID",
        ipAddress: "IP 地址",
        errorTryAgain: "请重试",
        tryAgainButton: "重试"
      };
      var chineseTraditionalTranslations = {
        challengeTitle: "再一個步驟",
        challengeSubtitle: "請完成安全性確認以繼續",
        sessionID: "階段 ID",
        ipAddress: "IP 位址",
        errorTryAgain: "請再試一次",
        tryAgainButton: "再試一次"
      };
      // Object containing translations for different languages and locales
      var translations = {
        ar: {
          challengeTitle: "خطوة واحدة إضافية",
          challengeSubtitle: "يرجى إكمال فحص الأمان للمتابعة",
          sessionID: "مُعرّف الجلسة",
          ipAddress: "عنوان IP",
          errorTryAgain: "يرجى المحاولة مرة أخرى.",
          tryAgainButton: "أعد المحاولة"
        },
        "de-DE": germanTranslations,
        de: germanTranslations,
        "en-US": englishTranslations,
        "en-us": englishTranslations,
        en: englishTranslations,
        "es-ES": spanishTranslations,
        "es-es": spanishTranslations,
        "es-MX": mexicanSpanishTranslations,
        "es-mx": mexicanSpanishTranslations,
        es: spanishTranslations,
        "fr-FR": frenchTranslations,
        "fr-fr": frenchTranslations,
        fr: frenchTranslations,
        "it-IT": italianTranslations,
        "it-it": italianTranslations,
        it: italianTranslations,
        "ja-JP": japaneseTranslations,
        "ja-jp": japaneseTranslations,
        ja: japaneseTranslations,
        "ko-KR": koreanTranslations,
        "ko-kr": koreanTranslations,
        ko: koreanTranslations,
        "pl-PL": polishTranslations,
        "pl-pl": polishTranslations,
        pl: polishTranslations,
        "pt-BR": portugueseTranslations,
        "pt-br": portugueseTranslations,
        pt: portugueseTranslations,
        "ru-RU": russianTranslations,
        "ru-ru": russianTranslations,
        ru: russianTranslations,
        th: {
          challengeTitle: "อีกขั้นตอนเดียวเท่านั้น",
          challengeSubtitle: "โปรดทำการตรวจสอบความปลอดภัยให้เสร็จเพื่อดำเนินการต่อ",
          sessionID: "ID เซสชัน",
          ipAddress: "ที่อยู่ IP",
          errorTryAgain: "โปรดลองอีกครั้ง",
          tryAgainButton: "ลองอีกครั้ง"
        },
        tr: {
          challengeTitle: "Son Bir Adım Daha",
          challengeSubtitle: "Devam etmek için lütfen bir güvenlik kontrolünü tamamla",
          sessionID: "Oturum NO",
          ipAddress: "IP Adresi",
          errorTryAgain: "Lütfen tekrar dene.",
          tryAgainButton: "Tekrar Dene"
        },
        "zh-CN": chineseSimplifiedTranslations,
        "zh-cn": chineseSimplifiedTranslations,
        "zh-TW": chineseTraditionalTranslations,
        "zh-tw": chineseTraditionalTranslations,
        zh: chineseSimplifiedTranslations
      };
      // Import required modules
      var styleLoader = require("style-loader");
      var cssLoader = require("css-loader");
      var postcssLoader = require("postcss-loader");
      var sassLoader = require("sass-loader");
      var miniCssExtractPlugin = require("mini-css-extract-plugin");
      // CSS modules configuration
      var cssModules = {};
      cssModules.styleTagTransform = styleTagTransform();
      cssModules.setAttributes = setAttributes();
      cssModules.insert = insert().bind(null, "head");
      cssModules.domAPI = domAPI();
      cssModules.insertStyleElement = insertStyleElement();
      // Apply style loader with CSS loader and modules
      styleLoader(cssLoader.Z, cssModules);
      // Check if cssLoader.Z and cssLoader.Z.locals exist
      if (cssLoader.Z && cssLoader.Z.locals) {
        cssLoader.Z.locals;
      }
      var debugMode = false;
      function debugLog() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args[i] = arguments[i];
        }
        if (debugMode) {
          console.log.apply(console, args);
        }
      }
      function logError() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args[i] = arguments[i];
        }
        if (debugMode) {
          console.error.apply(console, args);
        }
      }
      function delay(ms) {
        return new Promise(function (resolve) {
          return setTimeout(resolve, ms);
        });
      }
      function asyncOperation(thisArg, _arguments, generator) {
        return new (generator ||= Promise)(function (resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            var value;
            if (result.done) {
              resolve(result.value);
            } else {
              (value = result.value, value instanceof generator ? value : new generator(function (resolve) {
                resolve(value);
              })).then(fulfilled, rejected);
            }
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      }
      // Function to handle asynchronous generator operations
      function asyncGenerator(thisArg, body) {
        var _, f, y, g, _a;
        return g = {
          next: verb(0),
          throw: verb(1),
          return: verb(2)
        }, typeof Symbol == "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function (v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                if (t[2]) _.ops.pop();
                _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      }
      // Create an instance of axios with a timeout of 10 seconds
      var httpClient = axios.create({
        timeout: 10000
      });
      function discoverTask(urls) {
        return asyncOperation(this, undefined, function () {
          var i, url, response, error_1;
          return asyncGenerator(this, function (_a) {
            switch (_a.label) {
              case 0:
                i = 0;
                _a.label = 1;
              case 1:
                if (!(i < urls.length)) return [3, 6];
                url = urls[i];
                debugLog("[nelly] discovering task", url);
                _a.label = 2;
              case 2:
                _a.trys.push([2, 4, , 5]);
                return [4, httpClient.get(url)];
              case 3:
                response = _a.sent();
                debugLog("[nelly] discovered task", url);
                return [2, response.data];
              case 4:
                error_1 = _a.sent();
                logError("[nelly] error fetching discovery url", error_1);
                return [3, 5];
              case 5:
                i++;
                return [3, 1];
              case 6: throw "[nelly] failed to discover nelly task";
            }
          });
        });
      }
      function sendReport(task, source) {
        return asyncOperation(this, undefined, function () {
          var report, i, reportTo, error_2;
          return asyncGenerator(this, function (_a) {
            switch (_a.label) {
              case 0:
                report = {
                  source: source,
                  encountered_report_error: false
                };
                debugLog("[nelly] sending report");
                return [4, executeSubTasks(task)];
              case 1:
                report.results = _a.sent();
                i = 0;
                _a.label = 2;
              case 2:
                if (!(i < task.report_to.length)) return [3, 7];
                reportTo = task.report_to[i];
                report.provider = reportTo.provider;
                _a.label = 3;
              case 3:
                _a.trys.push([3, 5, , 6]);
                return [4, httpClient.post(reportTo.endpoint, report)];
              case 4:
                _a.sent();
                debugLog("[nelly] report acknowledged");
                return [2];
              case 5:
                error_2 = _a.sent();
                logError("[nelly] error sending report", error_2);
                report.encountered_report_error = true;
                return [3, 6];
              case 6:
                i++;
                return [3, 2];
              case 7: return [2];
            }
          });
        });
      }
      function executeSubTasks(task) {
        return asyncOperation(this, undefined, function () {
          var results, _i, _a, subTask, subTaskResult, error_3, performanceEntries, _b, performanceEntries_1, entry, _c, _d, subTask, performanceData;
          return asyncGenerator(this, function (_e) {
            switch (_e.label) {
              case 0:
                results = {};
                _i = 0, _a = task.sub_tasks;
                _e.label = 1;
              case 1:
                if (!(_i < _a.length)) return [3, 8];
                subTask = _a[_i];
                return [4, delay(100)];
              case 2:
                _e.sent();
                debugLog("[nelly] starting task", subTask.endpoint);
                subTaskResult = {
                  provider: subTask.provider,
                  successful: false
                };
                _e.label = 3;
              case 3:
                _e.trys.push([3, 5, , 6]);
                return [4, fetch(subTask.endpoint, {
                  method: "GET",
                  mode: "no-cors",
                  headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0"
                  }
                })];
              case 4:
                _e.sent();
                subTaskResult.successful = true;
                debugLog("[nelly] task completed", subTask.endpoint);
                return [3, 6];
              case 5:
                error_3 = _e.sent();
                subTaskResult.error = error_3.message;
                logError("[nelly] error sending report", subTask.endpoint, error_3);
                return [3, 6];
              case 6:
                results[subTask.task_id] = subTaskResult;
                _e.label = 7;
              case 7:
                _i++;
                return [3, 1];
              case 8:
                performanceEntries = performance.getEntriesByType("resource");
                for (_b = 0, performanceEntries_1 = performanceEntries; _b < performanceEntries_1.length; _b++) {
                  entry = performanceEntries_1[_b];
                  for (_c = 0, _d = task.sub_tasks; _c < _d.length; _c++) {
                    subTask = _d[_c];
                    if (entry.name === subTask.endpoint) {
                      performanceData = entry;
                      results[subTask.task_id].performance = {
                        e2e: Math.floor(performanceData.duration)
                      };
                    }
                  }
                }
                return [4, delay(100)];
              case 9:
                _e.sent();
                debugLog("[nelly]", results);
                return [2, results];
            }
          });
        });
      }
      function executeTask(taskData, taskOptions, taskProbability) {
        const self = this;
        let args;
        const taskExecutor = function () {
          let taskResult;
          return function (thisArg, _arguments) {
            let step;
            let previousValue;
            let info;
            let resultHandler;
            const context = {
              label: 0,
              sent: function () {
                if (info[0] & 1) {
                  throw info[1];
                }
                return info[1];
              },
              trys: [],
              ops: []
            };
            resultHandler = {
              next: createStep(0),
              throw: createStep(1),
              return: createStep(2)
            };
            if (typeof Symbol == "function") {
              resultHandler[Symbol.iterator] = function () {
                return this;
              };
            }
            return resultHandler;
            function createStep(operationType) {
              return function (arg) {
                return executeStep([operationType, arg]);
              };
            }
            function executeStep(stepData) {
              if (step) {
                throw new TypeError("Generator is already executing.");
              }
              while (context) {
                try {
                  step = 1;
                  if (previousValue && (info = stepData[0] & 2 ? previousValue.return : stepData[0] ? previousValue.throw || ((info = previousValue.return) && info.call(previousValue), 0) : previousValue.next) && !(info = info.call(previousValue, stepData[1])).done) {
                    return info;
                  }
                  previousValue = 0;
                  if (info) {
                    stepData = [stepData[0] & 2, info.value];
                  }
                  switch (stepData[0]) {
                    case 0:
                    case 1:
                      info = stepData;
                      break;
                    case 4:
                      context.label++;
                      return {
                        value: stepData[1],
                        done: false
                      };
                    case 5:
                      context.label++;
                      previousValue = stepData[1];
                      stepData = [0];
                      continue;
                    case 7:
                      stepData = context.ops.pop();
                      context.trys.pop();
                      continue;
                    default:
                      if (!((info = context.trys).length > 0 && info[info.length - 1]) && (stepData[0] === 6 || stepData[0] === 2)) {
                        context = 0;
                        continue;
                      }
                      if (stepData[0] === 3 && (!info || (stepData[1] > info[0] && stepData[1] < info[3]))) {
                        context.label = stepData[1];
                        break;
                      }
                      if (stepData[0] === 6 && context.label < info[1]) {
                        context.label = info[1];
                        info = stepData;
                        break;
                      }
                      if (info && context.label < info[2]) {
                        context.label = info[2];
                        context.ops.push(stepData);
                        break;
                      }
                      if (info[2]) {
                        context.ops.pop();
                      }
                      context.trys.pop();
                      continue;
                  }
                  stepData = _arguments.call(thisArg, context);
                } catch (error) {
                  stepData = [6, error];
                  previousValue = 0;
                } finally {
                  step = info = 0;
                }
              }
              if (stepData[0] & 5) {
                throw stepData[1];
              }
              return {
                value: stepData[0] ? stepData[1] : undefined,
                done: true
              };
            }
          }(this, function (state) {
            switch (state.label) {
              case 0:
                // Check if the task should be skipped based on probability
                if (shouldSkipTask({
                  run: taskProbability,
                  sleep: 1 - taskProbability
                })) {
                  logDebug("[nelly] skipping invocation");
                  return [2];
                } else {
                  return [4, delay(1000)];
                }
              case 1:
                state.sent();
                logDebug("[nelly] running nelly");
                state.label = 2;
              case 2:
                state.trys.push([2, 5,, 6]);
                taskResult = executeNelly;
                return [4, prepareTask(taskData)];
              case 3:
                return [4, taskResult.apply(undefined, [state.sent(), taskOptions])];
              case 4:
                state.sent();
                return [3, 6];
              case 5:
                logError("[nelly] failed to discover nelly task", state.sent());
                return [3, 6];
              case 6:
                logDebug("[nelly] nelly complete");
                return [2];
            }
          });
        };
        return new ((Promise) || (Promise = Promise))(function (resolve, reject) {
          function handleNext(value) {
            try {
              step(taskExecutor.next(value));
            } catch (error) {
              reject(error);
            }
          }
          function handleError(error) {
            try {
              step(taskExecutor.throw(error));
            } catch (rejectError) {
              reject(rejectError);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : new Promise(function (resolve) {
              resolve(result.value);
            }).then(handleNext, handleError);
          }
          step((taskExecutor = taskExecutor.apply(self, args || [])).next());
        });
      }
      function mergeObjects() {
        mergeObjects = Object.assign || function (target) {
          var sources;
          for (var i = 1, len = arguments.length; i < len; i++) {
            for (var key in sources = arguments[i]) {
              if (Object.prototype.hasOwnProperty.call(sources, key)) {
                target[key] = sources[key];
              }
            }
          }
          return target;
        };
        return mergeObjects.apply(this, arguments);
      }
      function asyncOperation(thisArg, _arguments, generator) {
        return new ((generator = generator || Promise))(function (resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            var value;
            if (result.done) {
              resolve(result.value);
            } else {
              (value = result.value, value instanceof generator ? value : new generator(function (resolve) {
                resolve(value);
              })).then(fulfilled, rejected);
            }
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      }
      function generateAsyncIterator(context, body) {
        var state;
        var iterator;
        var result;
        var step;
        var control = {
          label: 0,
          sent: function () {
            if (result[0] & 1) {
              throw result[1];
            }
            return result[1];
          },
          trys: [],
          ops: []
        };
        step = {
          next: createStep(0),
          throw: createStep(1),
          return: createStep(2)
        };
        if (typeof Symbol == "function") {
          step[Symbol.iterator] = function () {
            return this;
          };
        }
        return step;
        function createStep(operation) {
          return function (arg) {
            return function (value) {
              if (state) {
                throw new TypeError("Generator is already executing.");
              }
              while (control) {
                try {
                  state = 1;
                  if (iterator && (result = value[0] & 2 ? iterator.return : value[0] ? iterator.throw || ((result = iterator.return) && result.call(iterator), 0) : iterator.next) && !(result = result.call(iterator, value[1])).done) {
                    return result;
                  }
                  iterator = 0;
                  if (result) {
                    value = [value[0] & 2, result.value];
                  }
                  switch (value[0]) {
                    case 0:
                    case 1:
                      result = value;
                      break;
                    case 4:
                      var yieldResult = {
                        value: value[1],
                        done: false
                      };
                      control.label++;
                      return yieldResult;
                    case 5:
                      control.label++;
                      iterator = value[1];
                      value = [0];
                      continue;
                    case 7:
                      value = control.ops.pop();
                      control.trys.pop();
                      continue;
                    default:
                      if (!(result = (result = control.trys).length > 0 && result[result.length - 1]) && (value[0] === 6 || value[0] === 2)) {
                        control = 0;
                        continue;
                      }
                      if (value[0] === 3 && (!result || value[1] > result[0] && value[1] < result[3])) {
                        control.label = value[1];
                        break;
                      }
                      if (value[0] === 6 && control.label < result[1]) {
                        control.label = result[1];
                        result = value;
                        break;
                      }
                      if (result && control.label < result[2]) {
                        control.label = result[2];
                        control.ops.push(value);
                        break;
                      }
                      if (result[2]) {
                        control.ops.pop();
                      }
                      control.trys.pop();
                      continue;
                  }
                  value = body.call(context, control);
                } catch (error) {
                  value = [6, error];
                  iterator = 0;
                } finally {
                  state = result = 0;
                }
              }
              if (value[0] & 5) {
                throw value[1];
              }
              var returnValue = {
                value: value[0] ? value[1] : undefined,
                done: true
              };
              return returnValue;
            }([operation, arg]);
          };
        }
      }
      var talonServiceUrls = {
        dev: "http://epicgames-local.ol.epicgames.net:12080",
        ci: "https://talon-service-ci.ecac.dev.use1a.on.epicgames.com",
        gamedev: "https://talon-service-gamedev.ecac.dev.use1a.on.epicgames.com",
        prod: "https://talon-service-prod.ecosec.on.epicgames.com",
        prod_akamai: "https://talon-service-prod.ak.epicgames.com",
        prod_cloudflare: "https://talon-service-prod.ecosec.on.epicgames.com"
      };
      var talonServiceV4Urls = {
        dev: "http://epicgames-local.ol.epicgames.net:12080",
        ci: "https://talon-service-ci.ecac.dev.use1a.on.epicgames.com",
        gamedev: "https://talon-service-gamedev.ecac.dev.use1a.on.epicgames.com",
        prod: "https://talon-service-prod.ecosec.on.epicgames.com",
        prod_akamai: "https://talon-service-v4-prod.ak.epicgames.com",
        prod_cloudflare: "https://talon-service-prod.ecosec.on.epicgames.com"
      };
      function getEnvironment(env) {
        return env || "prod";
      }
      /**
       * Retrieves a flow by its ID from the window.talon.flows object.
       * @param {string} flowId - The ID of the flow to retrieve.
       * @returns {Object} The flow object corresponding to the given flowId.
       * @throws {Error} If the flow with the given ID does not exist.
       */
      function getFlow(flowId) {
        if (!window.talon.flows[flowId]) {
          logError(new Error(`attempted to access flow_id "${flowId}" but it did not exist`), undefined);
          throw `attempted to access flow_id "${flowId}" but it did not exist`;
        }
        return window.talon.flows[flowId];
      }
      /**
       * Initializes a flow based on the provided configuration.
       * If a flow with the same ID already exists, it retrieves the existing flow.
       * @param {Object} config - The configuration object for the flow.
       * @param {string} config.flow - The ID of the flow to initialize or retrieve.
       * @returns {Object|undefined} The existing flow object if found, otherwise undefined.
       */
      function initializeFlow(config) {
        var existingFlow;
        if (window.talon.flows[config.flow]) {
          existingFlow = getFlow(config.flow);
        }
        if (existingFlow) {
          existingFlow.config = config;
          if (config.onReady && existingFlow.session) {
            config.onReady(existingFlow.session);
          }
          return;
        }
        // Initialize the flow object in the window.talon.flows
        window.talon.flows[config.flow] = {
          config: config,
          ready: false,
          open: false,
          // Set a timeout to log a metric if the flow is not ready within 15 seconds
          loadWatchdog: setTimeout(function () {
            var flow = getFlow(config.flow);
            logMetric(flow.config.env, "sla_miss_ready", flow.session);
          }, 15000)
        };
        (function (config) {
          return asyncFunction(this, undefined, undefined, function () {
            var axiosInstance;
            var response;
            var responseData;
            var sessionData;
            var sessionMode;
            var sessionConfig;
            var currentFlow;
            return asyncGenerator(this, function (state) {
              switch (state.label) {
                case 0:
                  // Log the initialization of the SDK
                  logMetric(config.env, "sdk_init");
                  // Create an axios instance with base URL and timeout
                  axiosInstance = axios.create({
                    baseURL: serviceUrls[getEnvironment(config.env)],
                    timeout: 25000
                  });
                  // Set up retry logic for the axios instance
                  setupRetry(axiosInstance, {
                    retries: 3,
                    shouldResetTimeout: true,
                    retryCondition: function (error) {
                      return axios.isNetworkOrIdempotentRequestError(error) || error.code === "ECONNABORTED";
                    },
                    retryDelay: exponentialDelay
                  });
                  // Make a POST request to initialize the flow
                  return [4, axiosInstance.post("/v1/init", {
                    flow_id: config.flow
                  }, {
                    withCredentials: true
                  })];
                case 1:
                  // Handle the response from the initialization request
                  response = state.sent();
                  responseData = response.data;
                  // Store the session data in the flow object
                  getFlow(config.flow).session = responseData;
                  sessionData = response.data.session;
                  sessionMode = sessionData.plan.mode;
                  sessionConfig = sessionData.config;
                  currentFlow = getFlow(config.flow);
                  // Log the completion of SDK initialization
                  logMetric(config.env, "sdk_init_complete", currentFlow.session);
              }
            });
          });
        });      (function (config) {
          if (config.session.session.plan.mode === "h_captcha") {
              var hCaptchaDiv = document.createElement("div");
              hCaptchaDiv.id = `h_captcha_checkbox_${config.session.session.flow_id}`;
              document.body.appendChild(hCaptchaDiv);
          }
          var challengeContainer;
          var closeButton;
          var challengeContent;
          var talonContainer = document.createElement("div");
          talonContainer.id = `talon_container_${config.session.session.flow_id}`;
          talonContainer.style.visibility = "hidden";
          talonContainer.style.opacity = "0";
          talonContainer.style.zIndex = "-1";
          talonContainer.style.width = "100%";
          talonContainer.style.height = "100%";
          talonContainer.style.border = "none";
          talonContainer.style.top = "0";
          talonContainer.style.left = "0";
          talonContainer.style.position = "fixed";
          talonContainer.style.transition = "0.3s";
          talonContainer.style.background = "#141414";
          talonContainer.style.color = "#fff";
          talonContainer.style.textAlign = "center";
          talonContainer.style.display = "flex";
          talonContainer.style.justifyContent = "center";
          talonContainer.style.flexDirection = "column";
          challengeContent = "<div class=\"talon_challenge_container\"> <a onclick='talon.close(\"{{flowID}}\")' class=\"talon_close_button\"><img src=\"{{close}}\" alt=\"Close\"/></a> <div class=\"talon_challenge_header\"> <img class=\"talon_logo\" src=\"{{logo}}\" alt=\"Epic Games Logo\"/> <h1>{{challengeTitle}}</h1> <h4>{{challengeSubtitle}}</h4> <p><b>{{sessionID}}</b>: {{sessionIDValue}} | <b>{{ipAddress}}</b>: {{ipAddressValue}}</p> <hr/> <div id=\"talon_error_container_{{flowID}}\" class=\"talon_error_container\"> <p id=\"talon_error_message_{{flowID}}\">{{errorMessage}}</p> <button onclick='talon.execute(\"{{flowID}}\"),document.getElementById(\"talon_error_container_{{flowID}}\").style.display=\"none\"'>TRY AGAIN</button> </div> </div> <div id=\"h_captcha_challenge_{{flowID}}\" class=\"h_captcha_challenge\"></div> </div>";
          challengeContainer = {
                      sessionIDValue: _0x5e3152.session.session.id,
                      ipAddressValue: _0x5e3152.session.session.ip_address,
                      flowID: _0x5e3152.session.session.flow_id,
                      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQ2IiBoZWlnaHQ9IjYzMiIgdmlld0JveD0iMCAwIDU0NiA2MzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yMzYuMjQ1IDIxMC42NjdDMjQ1LjIzNiAyMTAuNjY3IDI0Ny45NDUgMjA2Ljc3NCAyNDcuOTQ1IDE5Ni44NTlWMTM0LjU0MUMyNDcuOTQ1IDEyNC42MjYgMjQ1LjIzNiAxMjAuMDI4IDIzNi4yNDUgMTIwLjAyOEgyMjMuMTQyVjIxMC42NjdIMjM2LjI0NVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMDYuMTgzIDQzOS4xMjlMMjA2LjQ4NiA0NDAuMDIxTDIwNi44ODMgNDQwLjkwNEgxOTAuMDM4TDE5MC40MzUgNDQwLjAyMUwxOTAuNzM4IDQzOS4xMjlMMTkxLjEzNSA0MzguMTQ0TDE5MS41NDEgNDM3LjI2MUwxOTEuODM1IDQzNi4zNjlMMTkyLjIzMiA0MzUuNDg2TDE5Mi42MjkgNDM0LjUwMUwxOTMuMDI2IDQzMy42MDlMMTkzLjMyOSA0MzIuNzI2TDE5My43MjYgNDMxLjg0NEwxOTQuMTI0IDQzMC45NTJMMTk0LjQyNiA0MjkuOTY2TDE5NC44MjQgNDI5LjA4NEwxOTUuMjIxIDQyOC4xOTFMMTk1LjUyNCA0MjcuMzA5TDE5NS45MjEgNDI2LjQxN0wxOTYuMzE4IDQyNS40MzJMMTk2LjcxNSA0MjQuNTQ5TDE5Ny4wMTggNDIzLjY1N0wxOTcuNDE1IDQyMi43NjRMMTk3LjgxMiA0MjEuNzg5TDE5OC4xMTUgNDIwLjg5N0wxOTguNTEyIDQyMC4wMDRMMTk4LjkxIDQyMC44OTdMMTk5LjIxMiA0MjEuNzg5TDE5OS42IDQyMi43NjRMMjAwLjAwNyA0MjMuNjU3TDIwMC4zMSA0MjQuNTQ5TDIwMC43MDcgNDI1LjQzMkwyMDEuMTA0IDQyNi40MTdMMjAxLjM5NyA0MjcuMzA5TDIwMS44MDQgNDI4LjE5MUwyMDIuMjAxIDQyOS4wODRMMjAyLjQ5NCA0MjkuOTY2TDIwMi45MDEgNDMwLjk1MkwyMDMuMTk0IDQzMS44NDRMMjAzLjk4OSA0MzMuNjA5TDIwNC4yOTIgNDM0LjUwMUwyMDQuNjg5IDQzNS40ODZMMjA1LjA4NiA0MzYuMzY5TDIwNS4zODkgNDM3LjI2MUwyMDUuNzg2IDQzOC4xNDRMMjA2LjE4MyA0MzkuMTI5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDQ5LjUyOTJDMCAxMy4zNDggMTMuMTk2NyAwIDQ4Ljk0OTIgMEg0OTYuNTY3QzUzMi4zMTkgMCA1NDUuNTE2IDEzLjM0OCA1NDUuNTE2IDQ5LjUyOTJWNDg2LjEyMUM1NDUuNTE2IDQ5MC4yMjIgNTQ1LjUxNiA1MTguNTQ2IDUxNy40MzkgNTMzLjUxQzQ4OS4zNjIgNTQ4LjQ3MyAyOTcuNzQ2IDYyNS41NTYgMjk3Ljc0NiA2MjUuNTU2QzI4Ni40NjkgNjMwLjc4OSAyODEuMDE2IDYzMi4xNDkgMjcyLjc1OCA2MzEuOTg3QzI2My40ODggNjMxLjk4NyAyNjAuMDEyIDYzMC43NTcgMjQ3LjY1NyA2MjUuNTU2QzI0Ny42NTcgNjI1LjU1NiA1Ni4xNzMxIDU0NS45NzQgMjguMDg2NSA1MzMuNTFDMi4zNDIxNCA1MjEuNTU4IDEuMzE3NSA1MDcuOTM2IDAuNjk1NDMgNDk5LjY2NkMwLjYzODgzNiA0OTguOTE0IDAuNTg1NTc1IDQ5OC4yMDYgMC41MTczMzQgNDk3LjU0N0MwLjE1OTkwMyA0OTQuMDE4IDAgNDkwLjIyMiAwIDQ4Ni4xMjFWNDkuNTI5MlpNMTczLjU4NSAxODYuMDE2VjIyMy4xNTZIMTI0LjEyOFYyOTcuNTI0SDE3My41ODVWMzM0LjU4OEg4Ni43OTI0Vjg2Ljc0NTFIMTczLjU4NVYxMjMuODY2SDEyNC4xMjhWMTg2LjAxNkgxNzMuNTg1Wk00MDcuMDY2IDMwMi40ODVDNDE2LjY4NSAzMDIuNDg1IDQyMS41ODQgMjk3Ljk2NSA0MjEuNTg0IDI4OC4yMTdWMjM1LjQ4N0g0NTguNzZWMjg5Ljk1NkM0NTguNzYgMzIwLjI0MiA0NDMuMzYzIDMzNC43MzkgNDEyLjM0MyAzMzQuNzM5SDM5My40NEMzNjIuNDMgMzM0LjczOSAzNDcuMTcgMzIwLjI0MiAzNDcuMTcgMjg5Ljk1NlYxMzYuMzQzQzM0Ny4xNyAxMDYuMDU4IDM2Mi40MyA4Ni45Njk3IDM5My40NCA4Ni45Njk3SDQxMS45ODlDNDQzIDg2Ljk2OTcgNDU4Ljc2IDEwMi4yODMgNDU4Ljc2IDEzMi41NTlWMTg1LjkzOEw0MjEuNTg0IDE4NS44NzJWMTM2LjM0M0M0MjEuNTg0IDEyNC4wNDEgNDE4LjA1MSAxMjAuMDg2IDQwNi4zNDggMTIwLjA4NkgzOTkuOTM1QzM4OS45NTMgMTIwLjA4NiAzODQuNDc5IDEyNi41OTUgMzg0LjQ3OSAxMzYuMzQzVjI4OC4yMTdDMzg0LjQ3OSAyOTcuOTY1IDM4OS45NTMgMzAyLjQ4NSAzOTkuOTM1IDMwMi40ODVINDA3LjA2NlpNMjk3LjU3NCAzMzQuNTg4SDMzNC43NzFWODYuNzQ1MUgyOTcuNTc0VjMzNC41ODhaTTE4NS45ODQgMzM0LjU4OFY4Ni43NDUxSDI0MS45MDJDMjcwLjg2NyA4Ni43NDUxIDI4NS4xNzUgMTAxLjk2NyAyODUuMTc1IDEzMi43NzJWMTk4LjYzOEMyODUuMTc1IDIyOS40MzIgMjcwLjg2NyAyNDQuNjU0IDI0MS45MDIgMjQ0LjY1NEgyMjMuMTQyVjMzNC41ODhIMTg1Ljk4NFpNNDY0Ljc2MSA0NTAuODQ4TDQ2NC44NjUgNDQ5Ljg2M0w0NjQuOTU5IDQ0OC43NzVWNDQ2LjQxNUw0NjQuODY1IDQ0NS4zMzdMNDY0Ljc2MSA0NDQuMzUyTDQ2NC4zNjMgNDQyLjM4Mkw0NjQuMTY1IDQ0MS40OTlMNDYzLjg3MSA0NDAuNjE2TDQ2My41NjkgNDM5LjcyNEw0NjMuMTcyIDQzOC45NDNMNDYyLjY3IDQzOC4wNTFMNDYyLjE2OSA0MzcuMjcxTDQ2MS41NzMgNDM2LjM4OEw0NjAuOTc3IDQzNS41OThMNDYwLjI3NyA0MzQuOTFMNDU5LjU3NyA0MzQuMTJMNDU3Ljk4OCA0MzIuNzQ1TDQ1Ny4xODQgNDMyLjI1M0w0NTYuMzkgNDMxLjY1OEw0NTUuNTk1IDQzMS4xNzVMNDUzLjc5OCA0MzAuMTlMNDUyLjgwNSA0MjkuNjk3TDQ1MS44MDIgNDI5LjI5N0w0NTAuODA5IDQyOC44MDVMNDQ5LjcxMiA0MjguNDI0TDQ0OC44MTQgNDI4LjEyNkw0NDcuOTI0IDQyNy44MjlMNDQ2LjkyMiA0MjcuNTQxTDQ0Ni4wMjMgNDI3LjI0NEw0NDQuMDM3IDQyNi42NDlMNDQzLjAzNCA0MjYuNDU0TDQ0MS45MzcgNDI2LjE1Nkw0NDAuOTQ0IDQyNS44NjhMNDM5Ljg0NyA0MjUuNjY0TDQzOC43NSA0MjUuMzc2TDQzNi41NTUgNDI0Ljc4MUw0MzUuNTYyIDQyNC41ODZMNDM0LjY2NCA0MjQuMjg5TDQzMy43NjUgNDI0LjA5M0w0MzIuOTcgNDIzLjc5Nkw0MzIuMTc2IDQyMy42MDFMNDMwLjk3NSA0MjMuMjExTDQyOS44NzggNDIyLjgxMUw0MjguODg0IDQyMi40MjFMNDI4LjA5IDQyMS45MjhMNDI3LjE4MiA0MjEuNDM2TDQyNi40OTEgNDIwLjc0OEw0MjYuMDg1IDQyMC4xNjJMNDI1LjU5MyA0MTkuMDc1TDQyNS40ODkgNDE3LjgwMlY0MTcuNTk4TDQyNS41OTMgNDE2LjYyMkw0MjUuOTkgNDE1LjczTDQyNi41ODYgNDE0Ljg0N0w0MjcuNDg1IDQxNC4wNTdMNDI4LjE4NCA0MTMuNjY3TDQyOC45NzkgNDEzLjI3Nkw0MjkuODc4IDQxMy4wODFMNDMwLjg4IDQxMi44NzdMNDMxLjk2OCA0MTIuNjgySDQzNC4xNjJMNDM1LjA2MSA0MTIuNzg0TDQzNi4wNjMgNDEyLjg3N0w0MzcuMDU3IDQxMi45NzlMNDM5LjA0MyA0MTMuMzY5TDQ0MC4wNDUgNDEzLjU2NEw0NDEuMDM5IDQxMy44NjJMNDQyLjA0MSA0MTQuMTU5TDQ0My4xMjkgNDE0LjQ1N0w0NDMuOTMzIDQxNC44NDdMNDQ0LjgzMSA0MTUuMTQ0TDQ0NS42MjYgNDE1LjUzNUw0NDYuNTI1IDQxNS45MjVMNDQ3LjMxOSA0MTYuMzI0TDQ0OC4yMTggNDE2LjcxNUw0NDkuMDEyIDQxNy4yMDdMNDQ5LjkxMSA0MTcuNTk4TDQ1MC43MTUgNDE4LjE5Mkw0NTEuNTA5IDQxOC42ODVMNDUyLjM5OCA0MTkuMTc3TDQ1My4yMDIgNDE5Ljc2M0w0NTMuNzk4IDQxOC45ODJMNDU0LjI5OSA0MTguMTkyTDQ1NC44OTUgNDE3LjQwMkw0NTUuNDkxIDQxNi42MjJMNDU2LjA4NyA0MTUuNzNMNDU2LjU4OCA0MTQuOTQ5TDQ1Ny4xODQgNDE0LjE1OUw0NTcuNzkgNDEzLjM2OUw0NTguMjgxIDQxMi41ODlMNDU4Ljg3NyA0MTEuNzk5TDQ1OS40ODMgNDExLjAwOUw0NTkuOTg0IDQxMC4yMjhMNDYwLjU3IDQwOS4zMzZMNDYxLjE3NiA0MDguNTU2TDQ2MS43NzIgNDA3Ljc2Nkw0NjIuMjczIDQwNi45NzZMNDYyLjg2OSA0MDYuMTg2TDQ2MS4yOCA0MDUuMDE1TDQ2MC40NzYgNDA0LjQyTDQ1OS42ODEgNDAzLjkyOEw0NTguNzgzIDQwMy4zNDJMNDU3Ljk4OCA0MDIuODVMNDU2LjE5MSA0MDEuODY1TDQ1NS4zOTcgNDAxLjQ2NUw0NTQuNDk4IDQwMC45ODJMNDUzLjQ5NSA0MDAuNTgyTDQ1Mi42MDYgNDAwLjE5Mkw0NTEuNzA4IDM5OS44MDJMNDUwLjgwOSAzOTkuNTA0TDQ0OS44MDcgMzk5LjEwNUw0NDguOTE4IDM5OC45MDlMNDQ4LjAxOSAzOTguNjEyTDQ0Ny4wMTYgMzk4LjMyNEw0NDYuMTI3IDM5OC4xMjlMNDQ1LjEyNSAzOTcuOTI0TDQ0NC4xMzIgMzk3LjcyOUw0NDMuMjMzIDM5Ny41MzRMNDQyLjI0IDM5Ny4zMzlMNDQxLjE0MyAzOTcuMjM3TDQ0MC4xNDkgMzk3LjA0Mkw0MzkuMDQzIDM5Ni45NDlINDM4LjA1TDQzNS44NTUgMzk2Ljc0NEg0MzEuNTcxTDQyOS41ODQgMzk2Ljk0OUw0MjguNTgyIDM5Ny4wNDJMNDI3LjU4OSAzOTcuMTQ0TDQyNi42OSAzOTcuMzM5TDQyNS42OTcgMzk3LjUzNEw0MjQuNzg5IDM5Ny43MjlMNDIzLjkgMzk3LjkyNEw0MjMuMTA1IDM5OC4xMjlMNDIyLjE5NyAzOTguNDE3TDQyMS4yMDQgMzk4LjgxNkw0MjAuMjExIDM5OS4xMDVMNDE5LjMxMiAzOTkuNTA0TDQxOC40MTQgMzk5Ljk5N0w0MTcuNTE1IDQwMC4zODdMNDE2LjYxNyA0MDAuODhMNDE1LjgyMiA0MDEuMzcyTDQxNS4wMjggNDAxLjk1OEw0MTQuMjI0IDQwMi41NTJMNDEzLjUzMyA0MDMuMDQ1TDQxMi43MjkgNDAzLjczMkw0MTIuMDM5IDQwNC41MjJMNDExLjMzOSA0MDUuMjFMNDEwLjYzOSA0MDUuOTkxTDQwOS40NDcgNDA3LjU3TDQwOC45NDYgNDA4LjQ1M0w0MDguNDU0IDQwOS4zMzZMNDA4LjA0NyA0MTAuMjI4TDQwNy4yNTMgNDExLjk5NEw0MDcuMDU0IDQxMi44NzdMNDA2Ljc1MSA0MTMuNzY5TDQwNi4zNTQgNDE1LjUzNUw0MDYuMjUgNDE2LjUyTDQwNi4xNTYgNDE3LjQwMkw0MDYuMDUyIDQxOC4zODdWNDIwLjY1NUw0MDYuMjUgNDIyLjcxOEw0MDYuMzU0IDQyMy43MDNMNDA2LjU1MyA0MjQuNTg2TDQwNi43NTEgNDI1LjU3MUw0MDcuMDU0IDQyNi4zNTJMNDA3LjM0NyA0MjcuMjQ0TDQwNy42NSA0MjguMDI0TDQwOC4wNDcgNDI4LjcxMkw0MDguNTQ5IDQyOS41OTVMNDA5LjA0IDQzMC4zODVMNDA5LjU0MiA0MzEuMDcyTDQxMC4xMzggNDMxLjc2TDQxMC43NDMgNDMyLjQ0OEw0MTEuNDMzIDQzMy4xMzVMNDEyLjEzMyA0MzMuODIzTDQxMi44MzMgNDM0LjQxOEw0MTMuNjI4IDQzNC45MUw0MTQuNDMyIDQzNS40OTZMNDE1LjMyMSA0MzUuOTg4TDQxNi4xMjUgNDM2LjQ4MUw0MTcuMTE4IDQzNi45NzNMNDE4LjAxNyA0MzcuNDY2TDQxOS4wMSA0MzcuODU2TDQyMC4wMTIgNDM4LjI1Nkw0MjEuMDA1IDQzOC42NDZMNDIyLjEwMyA0MzkuMDM2TDQyMy45IDQzOS42MzFMNDI0Ljc4OSA0MzkuOTI5TDQyNS43OTEgNDQwLjEyNEw0MjYuNjkgNDQwLjQyMUw0MjcuNjgzIDQ0MC43MDlMNDI4LjY3NiA0NDAuOTA0TDQyOS42NzkgNDQxLjIwMkw0MzAuNjcyIDQ0MS4zOTdMNDMxLjc2OSA0NDEuNjk0TDQzMi43NzIgNDQxLjg4OUw0MzMuODYgNDQyLjE4N0w0MzQuODYyIDQ0Mi4zODJMNDM1Ljg1NSA0NDIuNjc5TDQzNi43NTQgNDQyLjg3NEw0MzcuNjUyIDQ0My4xNzJMNDM4LjQ0NyA0NDMuMzY3TDQzOS4xNDcgNDQzLjU2Mkw0NDAuMzM5IDQ0NC4wNTVMNDQxLjM0MSA0NDQuNDU0TDQ0Mi4yNCA0NDQuODQ1TDQ0My4wMzQgNDQ1LjIzNUw0NDMuODI5IDQ0NS44M0w0NDQuNTI5IDQ0Ni40MTVMNDQ1LjAzIDQ0Ny4xMDNMNDQ1LjQyNyA0NDguMDg4TDQ0NS41MzEgNDQ5LjI2OFY0NDkuNDYzTDQ0NS40MjcgNDUwLjQ0OEw0NDUuMTI1IDQ1MS4zMzFMNDQ0LjcyNyA0NTIuMTIxTDQ0NC4xMzIgNDUyLjgwOUw0NDMuMzM3IDQ1My40MDNMNDQyLjYzNyA0NTMuNzk0TDQ0MS44MzMgNDU0LjA5MUw0NDAuOTQ0IDQ1NC4yODZMNDQwLjA0NSA0NTQuNDgxTDQzOS4wNDMgNDU0LjY3Nkw0MzcuOTQ2IDQ1NC43NzlINDM1Ljc2MUw0MzQuNjY0IDQ1NC42NzZINDMzLjY3TDQzMi42NjggNDU0LjQ4MUw0MzEuNTcxIDQ1NC4zODhMNDMwLjU3NyA0NTQuMTg0TDQyOS41ODQgNDUzLjk4OUw0MjguNTgyIDQ1My43OTRMNDI3LjY4MyA0NTMuNDk2TDQyNi42OSA0NTMuMjA4TDQyNS42OTcgNDUyLjkxMUw0MjQuNzg5IDQ1Mi41Mkw0MjMuOSA0NTIuMjIzTDQyMy4wMDEgNDUxLjgyNEw0MjEuMjA0IDQ1MS4wNDNMNDIwLjQxIDQ1MC41NUw0MTkuNTExIDQ1MC4xNkw0MTguNzE2IDQ0OS42NThMNDE3LjgxOCA0NDkuMDczTDQxNy4wMTQgNDQ4LjU4TDQxNi4xMjUgNDQ3Ljk5NUw0MTUuMzIxIDQ0Ny40TDQxNC40MzIgNDQ2LjgwNUw0MTMuNjI4IDQ0Ni4yMkw0MTMuMDMyIDQ0Ny4wMUw0MTIuMzMyIDQ0Ny42OTdMNDExLjczNiA0NDguNDg3TDQxMS4wMzYgNDQ5LjI2OEw0MTAuNDQgNDQ5Ljk1Nkw0MDkuODQ0IDQ1MC43NDZMNDA5LjE0NCA0NTEuNTM1TDQwOC41NDkgNDUyLjIyM0w0MDcuODQ5IDQ1My4wMDRMNDA3LjI1MyA0NTMuNzAxTDQwNi41NTMgNDU0LjQ4MUw0MDUuOTU3IDQ1NS4yNzFMNDA1LjM2MSA0NTUuOTU5TDQwNC42NjEgNDU2Ljc0OUw0MDQuMDY1IDQ1Ny41MjlMNDAzLjM2NSA0NTguMjE3TDQwMi43NjkgNDU5LjAwN0w0MDMuNTY0IDQ1OS42OTVMNDA0LjI2NCA0NjAuMjg5TDQwNS4wNTggNDYwLjg3NUw0MDUuODUzIDQ2MS40N0w0MDYuNjU3IDQ2Mi4wNTVMNDA3LjQ1MSA0NjIuNjVMNDA5LjA0IDQ2My42MzVMNDA5Ljk0OCA0NjQuMTI3TDQxMC43NDMgNDY0LjYxMUw0MTEuNjMyIDQ2NS4xMDNMNDEyLjU0IDQ2NS41MDNMNDEzLjQyOSA0NjUuOTg2TDQxNC4zMjggNDY2LjM3Nkw0MTUuMjI2IDQ2Ni43NzZMNDE2LjIxOSA0NjcuMTY2TDQxNy4xMTggNDY3LjQ2NEw0MTguMTExIDQ2Ny43NjFMNDE5LjAxIDQ2OC4xNTFMNDIwLjAxMiA0NjguNDQ5TDQyMS4wMDUgNDY4LjczN0w0MjEuOTA0IDQ2OC45NDFMNDIyLjg5NyA0NjkuMjI5TDQyMy45IDQ2OS40MzRMNDI2Ljg4OSA0NzAuMDE5TDQyNy44ODIgNDcwLjEyMUw0MjguODg0IDQ3MC4zMTZMNDI5Ljk3MiA0NzAuNDA5TDQzMS45NjggNDcwLjYxNEg0MzMuMDY1TDQzNC4wNTggNDcwLjcwN0g0MzguMjQ4TDQ0MC4zMzkgNDcwLjUxMkw0NDEuMzQxIDQ3MC40MDlMNDQzLjIzMyA0NzAuMjE0TDQ0NC4yMzYgNDcwLjAxOUw0NDUuMTI1IDQ2OS44MjRMNDQ2LjAyMyA0NjkuNjI5TDQ0Ny4wMTYgNDY5LjQzNEw0NDcuOTI0IDQ2OS4xMzZMNDQ5LjkxMSA0NjguNTQyTDQ1MC45MDQgNDY4LjE1MUw0NTEuOTA2IDQ2Ny43NjFMNDUyLjgwNSA0NjcuMjY4TDQ1My42OTQgNDY2Ljg2OUw0NTQuNjAyIDQ2Ni4zNzZMNDU1LjM5NyA0NjUuNzkxTDQ1Ni4xOTEgNDY1LjMwOEw0NTYuOTg2IDQ2NC43MTNMNDU3LjY4NiA0NjQuMTI3TDQ1OC40OCA0NjMuNDNMNDU5Ljc3NiA0NjIuMTU3TDQ2MC4zNzIgNDYxLjQ3TDQ2MC44NzMgNDYwLjY4TDQ2MS40NjkgNDU5Ljg5TDQ2Mi40NzIgNDU4LjMxOUw0NjIuODY5IDQ1Ny40MzZMNDYzLjI2NiA0NTYuNjQ3TDQ2My42NjMgNDU1Ljc2NEw0NjMuOTY2IDQ1NC43NzlMNDY0LjE2NSA0NTMuODk2TDQ2NC40NTggNDUyLjkxMUw0NjQuNjY2IDQ1MS45MjZMNDY0Ljc2MSA0NTAuODQ4Wk0zMzcuODQ2IDQ2OS41MjdIMzk1Ljk1OVY0NTMuMzAxSDM1Ni44ODZWNDQxLjEwOUgzOTEuNTdWNDI1Ljg2OEgzNTYuODg2VjQxNC4xNTlIMzk1LjQ1OFYzOTcuOTI0SDMzNy44NDZWNDY5LjUyN1pNMzAzLjg5IDQ2OS41MjdIMzIzLjEyOVYzOTcuOTI0SDMwMi42OThMMzAyLjE5NyAzOTguNzE0TDMwMS43MDUgMzk5LjU5N0wzMDEuMSA0MDAuMzc4TDMwMC41OTggNDAxLjI3TDMwMC4xMDcgNDAyLjA1TDI5OS42MDUgNDAyLjk0M0wyOTkuMDA5IDQwMy43MjNMMjk4LjUwOCA0MDQuNjA2TDI5OC4wMDcgNDA1LjM5NkwyOTcuNTE1IDQwNi4xNzZMMjk2LjkxOSA0MDcuMDU5TDI5Ni40MTggNDA3Ljg0OUwyOTUuOTE2IDQwOC43MzJMMjk1LjQxNSA0MDkuNTIyTDI5NC44MjkgNDEwLjM5NkwyOTMuODI2IDQxMS45NzVMMjkzLjMyNSA0MTIuODQ5TDI5Mi44MzMgNDEzLjYzOUwyOTIuMjM3IDQxNC41MjJMMjkxLjczNiA0MTUuMzExTDI5MS4yMzQgNDE2LjE4NUwyOTAuNzMzIDQxNi45NzVMMjkwLjEzNyA0MTcuODU4TDI4OS42NDUgNDE4LjYzOEwyODkuMTQ0IDQxOS40MjhMMjg4LjY0MyA0MjAuMzExTDI4OC4wNDcgNDIxLjEwMUwyODcuNTQ2IDQyMS45ODRMMjg3LjA1NCA0MjIuNzY0TDI4Ni41NTIgNDIzLjY1N0wyODUuOTU3IDQyNC40MzdMMjg1LjQ1NSA0MjUuMzJMMjg0Ljk1NCA0MjYuMTFMMjg0LjQ2MiA0MjUuMzJMMjgzLjk2MSA0MjQuNDM3TDI4My4zNTUgNDIzLjY1N0wyODIuODY0IDQyMi43NjRMMjgyLjM2MiA0MjEuOTg0TDI4MS44NyA0MjEuMTAxTDI4MS4zNjkgNDIwLjMxMUwyODAuNzY0IDQxOS40MjhMMjgwLjI3MiA0MTguNjM4TDI3OS43NzEgNDE3Ljg1OEwyNzkuMjc5IDQxNi45NzVMMjc4Ljc3NyA0MTYuMTg1TDI3OC4xNzIgNDE1LjMxMUwyNzcuNjggNDE0LjUyMkwyNzcuMTc5IDQxMy42MzlMMjc2LjY4NyA0MTIuODQ5TDI3Ni4xODYgNDExLjk3NUwyNzUuNTgxIDQxMS4xODVMMjc1LjA4OSA0MTAuMzk2TDI3NC41ODcgNDA5LjUyMkwyNzQuMDg2IDQwOC43MzJMMjczLjQ5IDQwNy44NDlMMjcyLjk4OSA0MDcuMDU5TDI3Mi40OTcgNDA2LjE3NkwyNzEuOTk2IDQwNS4zOTZMMjcxLjQ5NCA0MDQuNjA2TDI3MC44OTkgNDAzLjcyM0wyNzAuNDA3IDQwMi45NDNMMjY5LjkwNSA0MDIuMDVMMjY5LjQwNCA0MDEuMjdMMjY4LjkwMyA0MDAuMzc4TDI2OC4zMDcgMzk5LjU5N0wyNjcuODA2IDM5OC43MTRMMjY3LjMxNCAzOTcuOTI0SDI0Ni44ODNWNDY5LjUyN0gyNjUuODE5VjQyNy4zODNMMjY2LjQxNSA0MjguMTczTDI2Ni45MTcgNDI5LjA2NUwyNjcuNTEyIDQyOS44NDZMMjY4LjAxNCA0MzAuNzM4TDI2OC42MSA0MzEuNTI4TDI2OS4xMDEgNDMyLjQxMUwyNjkuNzA3IDQzMy4yTDI3MC4xOTkgNDM0LjA4M0wyNzAuODA0IDQzNC44NzNMMjcxLjMwNSA0MzUuNzU2TDI3MS45MDEgNDM2LjU0NkwyNzIuNDAyIDQzNy40MzhMMjcyLjk4OSA0MzguMjI4TDI3My40OSA0MzkuMTExTDI3NC4wODYgNDM5LjkwMUwyNzQuNTg3IDQ0MC43ODNMMjc1LjE5MyA0NDEuNTczTDI3NS43ODkgNDQyLjQ1NkwyNzYuMjggNDQzLjI0NkwyNzYuODc2IDQ0NC4xMzhMMjc3LjM3OCA0NDQuOTI4TDI3Ny45ODMgNDQ1LjgxMUwyNzguNDc1IDQ0Ni42MDFMMjc5LjA4IDQ0Ny40ODRMMjc5LjU3MiA0NDguMjc0TDI4MC4xNjggNDQ5LjE1NkwyODAuNjY5IDQ0OS45NDZMMjgxLjI2NSA0NTAuODI5TDI4MS43NjYgNDUxLjYyOEwyODIuMzYyIDQ1Mi41MTFMMjgyLjg2NCA0NTMuMzAxTDI4My40NTkgNDU0LjE4NEwyODMuOTYxIDQ1NC45NzRMMjg0LjU1NyA0NTUuODU3SDI4NC45NTRMMjg1LjQ1NSA0NTUuMDc2TDI4Ni4wNTEgNDU0LjE4NEwyODYuNTUyIDQ1My4zOTRMMjg3LjE0OCA0NTIuNjA0TDI4Ny42NSA0NTEuNzIxTDI4OC4yNDUgNDUwLjkzMUwyODguNzM3IDQ1MC4xNDFMMjg5LjIzOSA0NDkuMjU5TDI4OS44NDQgNDQ4LjQ2OUwyOTAuMzM2IDQ0Ny42ODhMMjkwLjk0MSA0NDYuODg5TDI5MS40MzMgNDQ2LjAwNkwyOTIuMDI5IDQ0NS4yMTZMMjkyLjUzIDQ0NC40MzZMMjkzLjAzMSA0NDMuNTQzTDI5My42MjcgNDQyLjc1NEwyOTQuMTI5IDQ0MS45NjRMMjk0LjcyNSA0NDEuMDgxTDI5NS4yMTYgNDQwLjI5MUwyOTUuODIyIDQzOS41MDFMMjk2LjMyMyA0MzguNjE4TDI5Ni44MTUgNDM3LjgyOEwyOTcuNDIgNDM3LjA0OEwyOTcuOTEyIDQzNi4xNTZMMjk4LjUwOCA0MzUuMzY2TDI5OS4wMDkgNDM0LjU3NkwyOTkuNjA1IDQzMy43OTVMMzAwLjEwNyA0MzIuOTAzTDMwMC41OTggNDMyLjExM0wzMDEuMjA0IDQzMS4zMjNMMzAxLjcwNSA0MzAuNDRMMzAyLjMwMSA0MjkuNjUxTDMwMi44MDIgNDI4Ljg3TDMwMy4zOTggNDI3Ljk3OEwzMDMuODkgNDI3LjE4OFY0NjkuNTI3Wk0yMTguMjQzIDQ2OS41MjdIMjM4Ljc3N0wyMzcuOTgzIDQ2Ny43NjFMMjM3LjU4NiA0NjYuODY5TDIzNy4yODMgNDY1Ljg4NEwyMzYuODg2IDQ2NS4wMUwyMzYuNDg4IDQ2NC4xMjdMMjM2LjA5MSA0NjMuMjM1TDIzNS4yODcgNDYxLjQ3TDIzNC44OTkgNDYwLjQ4NUwyMzQuNDkzIDQ1OS42MDJMMjM0LjE5IDQ1OC43MUwyMzMuODAyIDQ1Ny44MjdMMjMzLjM5NSA0NTYuOTQ0TDIzMi45OTggNDU2LjA2MUwyMzIuNjAxIDQ1NS4wNzZMMjMyLjIwNCA0NTQuMTg0TDIzMS40IDQ1Mi40MThMMjMxLjEwNyA0NTEuNTM1TDIzMC43MDkgNDUwLjY0M0wyMzAuMzAzIDQ0OS42NThMMjI4LjcxNCA0NDYuMTI3TDIyOC4zMTYgNDQ1LjIzNUwyMjguMDE0IDQ0NC4yNUwyMjYuODIyIDQ0MS42MDFMMjI2LjQxNSA0NDAuNzA5TDIyNi4wMTggNDM5LjgyNkwyMjUuNjIxIDQzOC44NDFMMjI1LjIyMyA0MzcuOTU4TDIyNC45MjEgNDM3LjA3NkwyMjQuNTMzIDQzNi4xODNMMjI0LjEyNiA0MzUuMzAxTDIyMy43MjkgNDM0LjQxOEwyMjMuMzMyIDQzMy40MzNMMjIyLjkzNCA0MzIuNTVMMjIyLjEzIDQzMC43NzVMMjIxLjgzNyA0MjkuODkyTDIyMS40NCA0MjkuMDA5TDIyMS4wMzMgNDI4LjEyNkwyMjAuNjQ1IDQyNy4xNDFMMjE5Ljg0MSA0MjUuMzc2TDIxOS40NDQgNDI0LjQ4NEwyMTkuMDQ3IDQyMy42MDFMMjE4Ljc0NCA0MjIuNzE4TDIxOC4zNDcgNDIxLjczM0wyMTcuOTUgNDIwLjg1TDIxNy41NTIgNDE5Ljk1OEwyMTcuMTQ2IDQxOS4wNzVMMjE2LjM1MSA0MTcuMzFMMjE1Ljk1NCA0MTYuMzI0TDIxNS42NTEgNDE1LjQ0MkwyMTUuMjYzIDQxNC41NDlMMjE0Ljg1NyA0MTMuNjY3TDIxNC40NiA0MTIuNzg0TDIxNC4wNjIgNDExLjg5MkwyMTMuNjY1IDQxMC45MTZMMjEzLjI1OCA0MTAuMDI0TDIxMi44NjEgNDA5LjE0MUwyMTIuNTY4IDQwOC4yNThMMjEyLjE3MSA0MDcuMzc1TDIxMS43NjQgNDA2LjQ4M0wyMTEuMzc2IDQwNS40OThMMjEwLjk2OSA0MDQuNjE1TDIxMC4xNzUgNDAyLjg1TDIwOS43NzggNDAxLjk1OEwyMDkuNDc1IDQwMS4wNzVMMjA5LjA3OCA0MDAuMDlMMjA4LjI4MyAzOTguMzI0TDIwNy44NzYgMzk3LjQzMkgxODkuNDQyTDE4OS4wNDQgMzk4LjMyNEwxODguNjQ3IDM5OS4yMDdMMTg4LjI0IDQwMC4wOUwxODcuOTQ3IDQwMS4wNzVMMTg3LjU1IDQwMS45NThMMTg3LjE1MyA0MDIuODVMMTg2Ljc0NiA0MDMuNzMyTDE4Ni4zNTggNDA0LjYxNUwxODUuOTUyIDQwNS40OThMMTg1LjU1NCA0MDYuNDgzTDE4NS4xNDggNDA3LjM3NUwxODQuODU0IDQwOC4yNThMMTg0LjA2IDQxMC4wMjRMMTgzLjY2MyA0MTAuOTE2TDE4My4yNjUgNDExLjg5MkwxODIuODU5IDQxMi43ODRMMTgyLjA2NCA0MTQuNTQ5TDE4MS43NjEgNDE1LjQ0MkwxODEuMzY0IDQxNi4zMjRMMTgwLjk2NyA0MTcuMzFMMTc5Ljc3NSA0MTkuOTU4TDE3OS4zNzggNDIwLjg1TDE3OC45NzEgNDIxLjczM0wxNzguNjc4IDQyMi43MThMMTc3Ljg4MyA0MjQuNDg0TDE3Ny40NzcgNDI1LjM3NkwxNzYuNjgyIDQyNy4xNDFMMTc2LjI4NSA0MjguMTI2TDE3NS44ODggNDI5LjAwOUwxNzUuNTg1IDQyOS44OTJMMTc0Ljc5IDQzMS42NThMMTc0LjM5MyA0MzIuNTVMMTczLjk4NiA0MzMuNDMzTDE3My41ODkgNDM0LjQxOEwxNzIuNzk1IDQzNi4xODNMMTcyLjQ5MiA0MzcuMDc2TDE3MS42OTcgNDM4Ljg0MUwxNzEuMyA0MzkuODI2TDE3MC45MDMgNDQwLjcwOUwxNzAuNTA2IDQ0MS42MDFMMTcwLjEwOCA0NDIuNDg0TDE2OS43MDIgNDQzLjM2N0wxNjkuNDA5IDQ0NC4yNUwxNjkuMDExIDQ0NS4yMzVMMTY4LjYwNSA0NDYuMTI3TDE2Ny4wMTYgNDQ5LjY1OEwxNjYuNjE4IDQ1MC42NDNMMTY2LjMxNiA0NTEuNTM1TDE2NS4xMjQgNDU0LjE4NEwxNjQuNzE3IDQ1NS4wNzZMMTY0LjMyIDQ1Ni4wNjFMMTYzLjkzMiA0NTYuOTQ0TDE2My41MjUgNDU3LjgyN0wxNjMuMjIzIDQ1OC43MUwxNjIuODI1IDQ1OS42MDJMMTYyLjQyOCA0NjAuNDg1TDE2Mi4wMzEgNDYxLjQ3TDE2MS4yMzYgNDYzLjIzNUwxNjAuNDMyIDQ2NS4wMUwxNjAuMTMgNDY1Ljg4NEwxNTkuNzQyIDQ2Ni44NjlMMTU4LjkzOCA0NjguNjQ0TDE1OC41NDEgNDY5LjUyN0gxNzguNjc4TDE3OS4wNzUgNDY4LjY0NEwxNzkuMzc4IDQ2Ny43NjFMMTc5Ljc3NSA0NjYuODY5TDE4MC4xNzIgNDY1Ljg4NEwxODAuNDc1IDQ2NS4wMUwxODAuODcyIDQ2NC4xMjdMMTgxLjI3IDQ2My4yMzVMMTgxLjU2MyA0NjIuMzUyTDE4MS45NjkgNDYxLjQ3TDE4Mi4zNjcgNDYwLjU4N0wxODIuNjYgNDU5LjY5NUwxODMuMDU3IDQ1OC43MUwxODMuNDY0IDQ1Ny44MjdMMTgzLjc2NyA0NTYuOTQ0TDE4NC4xNTQgNDU2LjA2MUgyMTIuNzY2TDIxMy4xNjQgNDU2Ljk0NEwyMTMuNDY2IDQ1Ny44MjdMMjEzLjg2NCA0NTguNzFMMjE0LjI2MSA0NTkuNjk1TDIxNC41NTQgNDYwLjU4N0wyMTQuOTYxIDQ2MS40N0wyMTUuMzU4IDQ2Mi4zNTJMMjE1LjY1MSA0NjMuMjM1TDIxNi40NTUgNDY1LjAxTDIxNi43NDggNDY1Ljg4NEwyMTcuMTQ2IDQ2Ni44NjlMMjE3LjU1MiA0NjcuNzYxTDIxNy44NTUgNDY4LjY0NEwyMTguMjQzIDQ2OS41MjdaTTE0OS42NTkgNDYwLjk3N0wxNTAuNDYzIDQ2MC4zODJMMTUxLjE2MyA0NTkuNzk3VjQyNy44MjlIMTE4LjI2NlY0NDIuMTg3SDEzMi44MjNWNDUxLjEzNkwxMzIuMDI4IDQ1MS42MjhMMTMxLjMxOSA0NTIuMDI4TDEzMC40MyA0NTIuNDE4TDEyOS42MjYgNDUyLjgwOUwxMjguNzI3IDQ1My4yMDhMMTI3LjgzOCA0NTMuNDAzTDEyNi44NDUgNDUzLjcwMUwxMjUuODQzIDQ1My44OTZMMTI0Ljg0OSA0NTQuMDkxTDEyMS42NTIgNDU0LjM4OEgxMTkuMzYzTDExOC4yNjYgNDU0LjI4NkwxMTcuMjczIDQ1NC4xODRMMTE2LjI3MSA0NTMuOTg5TDExNS4yNzcgNDUzLjc5NEwxMTQuMjc1IDQ1My40OTZMMTEzLjI4MiA0NTMuMjA4TDExMi4zODMgNDUyLjgwOUwxMTEuNDg0IDQ1Mi40MThMMTEwLjU5NSA0NTIuMDI4TDEwOS43OTEgNDUxLjUzNUwxMDguOTk3IDQ1MS4wNDNMMTA4LjIwMiA0NTAuNDQ4TDEwNy4zOTggNDQ5Ljg2M0wxMDYuNzA4IDQ0OS4yNjhMMTA2LjEwMyA0NDguNThMMTA1LjQxMiA0NDcuODkzTDEwNC44MDcgNDQ3LjIwNUwxMDQuMjExIDQ0Ni40MTVMMTAzLjcxOSA0NDUuNjM0TDEwMy4yMDggNDQ0Ljg0NUwxMDIuNzE2IDQ0My45NjJMMTAyLjMxOSA0NDMuMDdMMTAxLjkxMiA0NDIuMDg1TDEwMS42MTkgNDQxLjMwNEwxMDEuMzI2IDQ0MC40MjFMMTAxLjEyNyA0MzkuNTI5TDEwMC43MjEgNDM3Ljc2M0wxMDAuNTIyIDQzNS44ODZMMTAwLjQyNyA0MzQuOTFWNDMyLjY0M0wxMDAuNjE3IDQzMC42ODJMMTAwLjgyNSA0MjkuNTk1TDEwMS4wMjMgNDI4LjcxMkwxMDEuMjIyIDQyNy43MzZMMTAxLjUyNSA0MjYuNzUxTDEwMS45MTIgNDI1Ljg2OEwxMDIuMjE1IDQyNC45NzZMMTAyLjYyMiA0MjQuMDkzTDEwMy4xMjMgNDIzLjMwM0wxMDMuNjE1IDQyMi40MjFMMTA0LjExNiA0MjEuNjMxTDEwNC42MDggNDIwLjk0M0wxMDUuMjEzIDQyMC4xNjJMMTA1LjkwNCA0MTkuNDY1TDEwNi41MDkgNDE4Ljc3OEwxMDcuMiA0MTguMTkyTDEwNy45IDQxNy41OThMMTA4LjYgNDE3LjAxMkwxMTAuMTg5IDQxNi4wMjdMMTEwLjk5MyA0MTUuNTM1TDExMS44OTEgNDE1LjE0NEwxMTIuNzggNDE0Ljc0NUwxMTMuNjc5IDQxNC40NTdMMTE0LjU3NyA0MTQuMTU5TDExNS40NzYgNDEzLjk2NEwxMTYuNDY5IDQxMy43NjlMMTE3LjM2OCA0MTMuNjY3TDExOC4zNyA0MTMuNTY0SDEyMC40NjFMMTIzLjY0OCA0MTMuODYyTDEyNC42NDEgNDE0LjA1N0wxMjUuNjQ0IDQxNC4yNjFMMTI2LjU0MiA0MTQuNDU3TDEyNy40MzIgNDE0Ljc0NUwxMjguMzMgNDE1LjA0MkwxMjkuMTM0IDQxNS4zMzlMMTI5LjkyOSA0MTUuNzNMMTMwLjczMyA0MTYuMTI5TDEzMS42MjIgNDE2LjYyMkwxMzIuNDE2IDQxNy4xMDVMMTMzLjIyIDQxNy41OThMMTM0LjAxNSA0MTguMDlMMTM0LjgwOSA0MTguNjg1TDEzNS42MTMgNDE5LjE3N0wxMzYuNDA4IDQxOS44NjVMMTM3LjIwMiA0MjAuNDVMMTM3Ljc5OCA0MTkuNjdMMTM4LjQ5OCA0MTguOTgyTDEzOS4wOTQgNDE4LjE5MkwxMzkuNzk0IDQxNy40MDJMMTQwLjM5IDQxNi42MjJMMTQwLjk5NSA0MTUuOTI1TDE0MS42ODYgNDE1LjE0NEwxNDIuMjkxIDQxNC4zNTRMMTQyLjk4MSA0MTMuNTY0TDE0My41ODcgNDEyLjg3N0wxNDQuMTgzIDQxMi4wOTZMMTQ0Ljg4MyA0MTEuMzA2TDE0NS40NzggNDEwLjYxOUwxNDYuMDc0IDQwOS44MjlMMTQ2Ljc3NCA0MDkuMDM5TDE0Ny4zNyA0MDguMjU4TDE0OC4wNyA0MDcuNTdMMTQ4LjY2NiA0MDYuNzgxTDE0Ny44NzEgNDA2LjE4NkwxNDcuMDY3IDQwNS40OThMMTQ2LjI3MyA0MDQuOTEzTDE0NS40NzggNDA0LjMxOEwxNDQuNjg0IDQwMy44MjVMMTQzLjg4OSA0MDMuMjRMMTQyLjk4MSA0MDIuNzQ3TDE0Mi4xODcgNDAyLjI1NUwxNDEuMjk4IDQwMS43NjJMMTQwLjQ5NCA0MDEuMjdMMTM5LjU5NSA0MDAuODhMMTM4LjcwNiA0MDAuMzg3TDEzNy43OTggMzk5Ljk5N0wxMzYuOTA5IDM5OS41OTdMMTM2LjAxIDM5OS4yMDdMMTM1LjExMiAzOTguOTA5TDEzNC4zMTcgMzk4LjYxMkwxMzMuNDE5IDM5OC40MTdMMTMyLjUyIDM5OC4xMjlMMTMxLjYyMiAzOTcuOTI0TDEzMC43MzMgMzk3LjcyOUwxMjkuODI1IDM5Ny41MzRMMTI3LjgzOCAzOTcuMTQ0TDEyNi45NCAzOTcuMDQyTDEyNS44NDMgMzk2Ljg0NkwxMjQuODQ5IDM5Ni43NDRIMTIzLjg0N0wxMjIuNzUgMzk2LjY1MUwxMjEuNjUyIDM5Ni41NDlIMTE3LjM2OEwxMTYuMzc1IDM5Ni42NTFMMTE1LjM3MiAzOTYuNzQ0TDExMy4zODYgMzk2Ljk0OUwxMTIuMzgzIDM5Ny4xNDRMMTExLjM5IDM5Ny4yMzdMMTEwLjM5NyAzOTcuNDMyTDEwOS40OTggMzk3LjcyOUwxMDguNDk2IDM5Ny45MjRMMTA3LjU5NyAzOTguMjIyTDEwNi43MDggMzk4LjQxN0wxMDUuODA5IDM5OC44MTZMMTA0LjgwNyAzOTkuMTA1TDEwNC4wMTIgMzk5LjQwMkwxMDMuMDE5IDM5OS44OTRMMTAyLjEyMSA0MDAuMjg1TDEwMS4yMjIgNDAwLjY4NEw5OC41MjYzIDQwMi4xNjJMOTcuNzQxMiA0MDIuNjU1TDk2LjkzNzMgNDAzLjEzOEw5Ni4xNDI4IDQwMy43MzJMOTUuMzM4OCA0MDQuMjI1TDk0LjU0NDMgNDA0LjgxTDkzLjg0NDMgNDA1LjQwNUw5My4wNDk4IDQwNi4wOTNMOTIuMzQ5OSA0MDYuNjc4TDkwLjk1OTUgNDA4LjA2M0w5MC4zNTQxIDQwOC43NTFMODkuNjYzNyA0MDkuNDM4TDg5LjA1ODMgNDEwLjEyNkw4OC40NjI0IDQxMC45MTZMODcuODY2NSA0MTEuNjk3TDg3LjI3MDcgNDEyLjQ4Nkw4Ni4yNjggNDE0LjA1N0w4NS43NzYyIDQxNC44NDdMODUuMjc0OSA0MTUuNjM3TDg0Ljc3MzYgNDE2LjUyTDg0LjM3NjMgNDE3LjQwMkw4My41ODE4IDQxOS4xNzdMODMuMTg0NiA0MjAuMDZMODIuNzc3OCA0MjEuMDQ1TDgyLjQ4NDYgNDIxLjkyOEw4Mi4xODIgNDIyLjkxM0w4MS44ODg3IDQyMy43OTZMODEuNjkwMSA0MjQuNzgxTDgxLjM4NzUgNDI1Ljc2Nkw4MS4xODg4IDQyNi42NDlMODEuMDg0OCA0MjcuNjM0TDgwLjg4NjEgNDI4LjYxTDgwLjY4NzUgNDMwLjY4MlY0MzEuNjU4TDgwLjU5MjkgNDMyLjc0NVY0MzUuOTg4TDgwLjc4MjEgNDM3Ljk1OEw4MC44ODYxIDQzOC45NDNMODAuOTkwMiA0MzkuODI2TDgxLjE4ODggNDQwLjgxMUw4MS4yODM0IDQ0MS42OTRMODEuNDgyIDQ0Mi42NzlMODEuNzg0NyA0NDMuNTYyTDgxLjk4MzMgNDQ0LjU0N0w4Mi4yODYgNDQ1LjQzTDgyLjQ4NDYgNDQ2LjMyMkw4Mi44ODE5IDQ0Ny4yMDVMODMuMTg0NiA0NDcuOTk1TDg0LjM3NjMgNDUwLjY0M0w4NC43NzM2IDQ1MS41MzVMODUuMjc0OSA0NTIuMzE2TDg1Ljc3NjIgNDUzLjIwOEw4Ni4yNjggNDUzLjk4OUw4Ni43Njk0IDQ1NC43NzlMODcuMzY1MiA0NTUuNTY5TDg3Ljg2NjUgNDU2LjM0OUw4OC40NjI0IDQ1Ny4wMzdMODkuMDU4MyA0NTcuODI3TDg5LjY2MzcgNDU4LjUxNEw5MC4zNTQxIDQ1OS4yMDJMOTEuMDU0MSA0NTkuODlMOTEuNzU0IDQ2MC40ODVMOTIuNDUzOSA0NjEuMTcyTDkzLjE0NDQgNDYxLjc2N0w5My44NDQzIDQ2Mi4zNTJMOTQuNjQ4MyA0NjIuOTQ3TDk1LjQ0MjggNDYzLjUzM0w5Ni4yMzczIDQ2NC4xMjdMOTcuMDMxOSA0NjQuNjExTDk3LjgzNTggNDY1LjEwM0w5OC43MzQ0IDQ2NS41OTZMOTkuNTI4OSA0NjYuMDg4TDEwMC40MjcgNDY2LjU4MUwxMDEuMzI2IDQ2Ni45NzFMMTAzLjEyMyA0NjcuNzYxTDEwNC4xMTYgNDY4LjE1MUwxMDUuMDA1IDQ2OC40NDlMMTA1LjkwNCA0NjguODM5TDEwNi44MDMgNDY5LjEzNkwxMDcuODA1IDQ2OS4zMzFMMTA4LjY5NCA0NjkuNjI5TDEwOS42OTcgNDY5LjgyNEwxMTAuNTk1IDQ3MC4wMTlMMTEyLjU4MiA0NzAuNDA5TDExNC41NzcgNDcwLjYxNEwxMTcuNjYxIDQ3MC45MDJIMTIxLjk1NUwxMjMuMDUyIDQ3MC44MDlMMTI0LjA0NSA0NzAuNzA3TDEyNS4xNDMgNDcwLjYxNEwxMjYuMTQ1IDQ3MC41MTJMMTI3LjIzMyA0NzAuNDA5TDEyOC4yMzYgNDcwLjMxNkwxMjkuMjI5IDQ3MC4xMjFMMTMwLjIzMSA0NjkuOTE3TDEzMS4xMiA0NjkuNzIyTDEzMi4xMjMgNDY5LjUyN0wxMzMuMDIyIDQ2OS4yMjlMMTM0LjAxNSA0NjguOTQxTDEzNi43MSA0NjguMDQ5TDEzNy41OTkgNDY3LjY1OUwxMzguNjAyIDQ2Ny4yNjhMMTM5LjUwMSA0NjYuODY5TDE0MC40OTQgNDY2LjQ3OEwxNDEuMzkyIDQ2NS45ODZMMTQyLjI5MSA0NjUuNTk2TDE0My4xOCA0NjUuMTAzTDE0NC4wNzkgNDY0LjYxMUwxNDQuOTc3IDQ2NC4xMjdMMTQ1Ljc3MiA0NjMuNjM1TDE0Ni41NzYgNDYzLjE0MkwxNDcuMzcgNDYyLjU0OEwxNDguMTY1IDQ2Mi4wNTVMMTQ4Ljk2OSA0NjEuNDdMMTQ5LjY1OSA0NjAuOTc3Wk0yNzIuNzc2IDU5NC44MjNMMzcxLjk2NyA1NTcuNjQ3SDE3My41ODVMMjcyLjc3NiA1OTQuODIzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
                      close: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMiAxOSA2LjQxeiIvPjwvc3ZnPg=="
                    };
                    container.innerHTML = generateHTML((defaultLanguage = "en-US", userLanguage = typeof window != "undefined" ? window.navigator.language : defaultLanguage, generateHTML("<div class=\"talon_challenge_container\"> <a onclick='talon.close(\"{{flowID}}\")' class=\"talon_close_button\"><img src=\"{{close}}\" alt=\"Close\"/></a> <div class=\"talon_challenge_header\"> <img class=\"talon_logo\" src=\"{{logo}}\" alt=\"Epic Games Logo\"/> <h1>{{challengeTitle}}</h1> <h4>{{challengeSubtitle}}</h4> <p><b>{{sessionID}}</b>: {{sessionIDValue}} | <b>{{ipAddress}}</b>: {{ipAddressValue}}</p> <hr/> <div id=\"talon_error_container_{{flowID}}\" class=\"talon_error_container\"> <p id=\"talon_error_message_{{flowID}}\">{{errorMessage}}</p> <button onclick='talon.execute(\"{{flowID}}\"),document.getElementById(\"talon_error_container_{{flowID}}\").style.display=\"none\"'>TRY AGAIN</button> </div> </div> <div id=\"h_captcha_challenge_{{flowID}}\" class=\"h_captcha_challenge\"></div> </div>", translations[userLanguage] ? translations[userLanguage] : translations["en-US"])), flowID);
                    document.body.appendChild(container);
                  })(flowData);
                  if (challengeType === "h_captcha") {
                    return [3, 2];
                  } else {
                    return [3, 5];
                  }
                case 2:
                  return [4, loadHCaptcha(0, config.h_captcha_config)];
                case 3:
                  result.sent();
                  return [4, initializeHCaptcha(flowData)];
                case 4:
                  result.sent();
                  return [3, 5];
                case 5:
                  getFlow(flowConfig.flow).ready = true;
                  sendEvent(flowConfig.env, "challenge_ready", flowData.session);
                  if (flowData.loadWatchdog) {
                    clearTimeout(flowData.loadWatchdog);
                  }
                  return [2, challengeData];
              }
            });
          });
        })(flowConfig).then(function (challengeResult) {
          if (flowConfig.onReady) {
            flowConfig.onReady(challengeResult);
          }
        }).catch(function (error) {
          return handleError(error, getFlow(flowConfig.flow));
        });
      }
      /**
       * Loads the hCaptcha SDK asynchronously.
       * @param {number} retryCount - The number of retry attempts (not used in the current implementation).
       * @param {Object} config - Configuration object for hCaptcha.
       * @param {string} [config.sdk_base_url] - Base URL for the hCaptcha SDK.
       * @param {string} [config.sdk_endpoint] - Custom endpoint for the hCaptcha API.
       * @param {string} [config.sdk_img_host] - Custom image host for hCaptcha.
       * @param {string} [config.sdk_report_api] - Custom report API for hCaptcha.
       * @param {string} [config.sdk_asset_host] - Custom asset host for hCaptcha.
       * @returns {Promise} A promise that resolves when the hCaptcha SDK is loaded.
       */
      function loadHCaptcha(retryCount, config) {
        return executeAsync(this, undefined, undefined, function () {
          var sdkBaseUrl;
          var queryParams;
          return generateSteps(this, function (step) {
            switch (step.label) {
              case 0:
                // Check if hCaptcha is already loaded
                if (window.hCaptchaReady) {
                  return [4, window.hCaptchaReady];
                } else {
                  return [3, 2];
                }
              case 1:
              case 4:
                step.sent();
                return [2];
              case 2:
                // Create a promise to track when hCaptcha is loaded
                window.hCaptchaReady = new Promise(function (resolve) {
                  window.hCaptchaLoaded = resolve;
                });
                // Set the base URL for the SDK
                sdkBaseUrl = (config?.sdk_base_url) ? config?.sdk_base_url : "https://js.hcaptcha.com";
                queryParams = "";
                // Add custom configuration parameters to the query string
                if (config?.sdk_endpoint) {
                  queryParams += `&endpoint=${encodeURIComponent(config?.sdk_endpoint)}`;
                }
                if (config?.sdk_img_host) {
                  queryParams += `&imghost=${encodeURIComponent(config?.sdk_img_host)}`;
                }
                if (config?.sdk_report_api) {
                  queryParams += `&reportapi=${encodeURIComponent(config?.sdk_report_api)}`;
                }
                if (config?.sdk_asset_host) {
                  queryParams += `&assethost=${encodeURIComponent(config?.sdk_asset_host)}`;
                }
                // Load the hCaptcha SDK script
                return [4, (sdkUrl = `${sdkBaseUrl}/1/api.js?onload=hCaptchaLoaded&render=explicit${queryParams}`, new Promise(function (resolve, reject) {
                  var script = document.createElement("script");
                  script.src = sdkUrl;
                  script.async = true;
                  script.defer = true;
                  script.onload = function () {
                    resolve();
                  };
                  script.onerror = function (error) {
                    reject(error);
                  };
                  document.head.appendChild(script);
                }))];
              case 3:
                step.sent();
                // Wait for hCaptcha to be fully loaded
                return [4, window.hCaptchaReady];
            }
            var sdkUrl;
          });
        });
      }
      function replaceTemplateVariables(template, variables) {
        let result = template;
        Object.keys(variables).forEach(function (key) {
          while (result.includes(`{{${key}}}`)) {
            result = result.replace(`{{${key}}}`, variables[key]);
          }
        });
        return result;
      }
      function toggleChallengeVisibility(state, isOpen) {
        const container = document.getElementById(`talon_container_${state.session.session.flow_id}`);
        if (isOpen !== state.open) {
          if (isOpen) {
            logEvent(state.config.env, "challenge_opened", state.session);
            container.style.visibility = "visible";
            container.style.opacity = "1";
            container.style.zIndex = "100000";
            document.body.style.height = "100vh";
            document.body.style.overflow = "hidden";
          } else {
            logEvent(state.config.env, "challenge_closed", state.session);
            container.style.visibility = "hidden";
            container.style.opacity = "0";
            container.style.zIndex = "-1";
            document.body.style.height = "auto";
            document.body.style.overflow = "auto";
            if (document.activeElement) {
              document.activeElement.blur();
            }
          }
          state.open = isOpen;
        }
      }
      function initializeHCaptcha(state) {
        if (!state.ready) {
          function onExpired() {
            if (state.config.onExpired) {
              state.config.onExpired();
            }
          }
          function onClosed() {
            toggleChallengeVisibility(state, false);
            if (state.config.onClosed) {
              state.config.onClosed();
            }
          }
          state.widgetID = window.hcaptcha.render(`h_captcha_checkbox_${state.session.session.flow_id}`, {
            sitekey: state.session.session.plan.h_captcha?.site_key,
            theme: window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
            callback: function (token) {
              handleCaptchaResponse(state, {
                h_captcha: {
                  value: token,
                  resp_key: window.hcaptcha.getRespKey(state.widgetID)
                }
              }).catch(function (error) {
                return handleError(error, state);
              });
            },
            "expire-callback": onExpired,
            "expired-callback": onExpired,
            "chalexpired-callback": onClosed,
            "error-callback": function (error) {
              if (error === "challenge-error") {
                toggleChallengeVisibility(state, true);
                logEvent(state.config.env, "challenge_rejected_answer", state.session);
                executeChallenge(state.config.flow);
              } else {
                toggleChallengeVisibility(state, true);
                logError(state.config.env, "challenge_error", state.session, error, null);
                document.getElementById(`talon_error_container_${state.config.flow}`).style.display = "flex";
                document.getElementById(`talon_error_message_${state.config.flow}`).innerText = error;
              }
            },
            "open-callback": function () {
              toggleChallengeVisibility(state, true);
              if (state.executeWatchdog) {
                clearTimeout(state.executeWatchdog);
              }
            },
            "close-callback": onClosed,
            size: "invisible",
            "challenge-container": `h_captcha_challenge_${state.session.session.flow_id}`
          });
        }
      }
      function waitForReady(config) {
        return new Promise(function (resolve, reject) {
          const originalOnReady = config.onReady;
          const originalOnError = config.onError;
          config.onReady = function (result) {
            if (originalOnReady) {
              originalOnReady(result);
            }
            resolve(result);
          };
          config.onError = function (error) {
            if (originalOnError) {
              originalOnError(error);
            }
            reject(error);
          };
        });
      }
      /**
       * Handles the captcha response.
       * @param {Object} state - The current state object.
       * @param {Object} response - The captcha response object.
       * @returns {Promise} A promise that resolves when the captcha response is handled.
       */
      function handleCaptchaResponse(state, response) {
        return new Promise(async function (resolve, reject) {
          try {
            const payload = {
              session_wrapper: state.session,
              plan_results: response
            };
            const deviceInfo = await getDeviceInfo({}, true);
            const result = Object.assign({}, payload, deviceInfo);
            logEvent(state.config.env, "challenge_complete", state.session);
            toggleChallengeVisibility(state, false);
            if (state.executeWatchdog) {
              clearTimeout(state.executeWatchdog);
            }
            if (state.config.onComplete) {
              state.config.onComplete(btoa(JSON.stringify(result)));
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      }
      /**
       * Executes the challenge for the given flow ID and form data.
       * @param {string} flowId - The ID of the flow to execute.
       * @param {Object} formData - The form data for the challenge.
       */
      function executeChallenge(flowId, formData) {
        // Capture the entry point of the challenge execution
        window.talon.entry = (function () {
          try {
            // Attempt to get the current stack trace
            return new Error().stack;
          } catch (error) {
            // Log any errors that occur while getting the stack trace
            logError(talon.env, "execute_challenge", talon.session, error.message, error.stack);
          }
        })();
        const state = getStateForFlow(flowId);
        logEvent(state.config.env, "sdk_execute", state.session);
        state.executeWatchdog = setTimeout(function () {
          const currentState = getStateForFlow(flowId);
          logEvent(currentState.config.env, "sla_miss_execute", currentState.session);
        }, 15000);
        // Determine the final form data to be used
        const finalFormData = formData || state.formData;
        // Update the state's form data if new form data is provided
        if (formData) {
          state.formData = formData;
        }
        // Immediately invoked async function to handle the challenge execution
        (async function (state, data) {
          try {
            // Wait for the state to be ready and session to be available
            if (!state.ready || !state.session) {
              await waitForReady(state.config);
            }
            // Prepare headers for the API request
            const headers = {};
            if (state.session.session.config.acid && state.session.session.config.acid.includes("argon")) {
              headers["X-Acid-Argon"] = state.session.session.id;
            }
            // Create an axios instance for making API requests
            const client = createAxiosInstance({
              baseURL: getApiUrl(state.config.env),
              timeout: 25000
            });
            // Get device information
            const deviceInfo = await getDeviceInfo({}, false);
            // Make a POST request to initialize the challenge execution
            const response = await client.post("/v1/init/execute", Object.assign({}, {
              session: state.session,
              form_data: data
            }, deviceInfo), {
              withCredentials: true,
              headers: headers
            });
            const responseData = response.data;
            // Log the challenge execution event
            logEvent(state.config.env, "challenge_execute", state.session);
            // Handle different challenge modes
            if (state.session.session.plan.mode === "h_captcha") {
              executeHCaptcha(state, responseData.h_captcha);
            } else {
              // Handle captcha response for other modes
              handleCaptchaResponse(state, {}).catch(function (error) {
                return handleError(error, state);
              });
            }
          } catch (error) {
            // Handle any errors that occur during the challenge execution
            handleError(error, getStateForFlow(state.config.flow));
          }
        })(state, finalFormData);
      }
      function closeChallenge(flowId) {
        const state = getStateForFlow(flowId);
        toggleChallengeVisibility(state, false);
        if (state.config.onClosed) {
          state.config.onClosed();
        }
      }
      function handleError(error, state) {
        logError((state?.config.env) || "prod", "execute_challenge", state?.session, error.message, error.stack);
        if (state.config.onError) {
          state.config.onError(error.message);
        }
      }
      if (!window?.talon) {
        window.talon = {
          flows: {},
          load: initializeTalon,
          loadSync: async function (config) {
            const readyPromise = waitForReady(config);
            initializeTalon(config);
            return readyPromise;
          },
          waitForLoad: waitForReady,
          execute: executeChallenge,
          executeSync: async function (flowId, formData) {
            const executionPromise = new Promise(function (resolve, reject) {
              const state = getStateForFlow(flowId);
              state.config.onComplete = function (result) {
                resolve(result);
              };
              state.config.onError = function (error) {
                reject(error);
              };
              state.config.onClosed = function () {
                reject("challenge closed");
              };
            });
            await executeChallenge(flowId, formData);
            return executionPromise;
          },
          remove: function (flowId) {
            const state = getStateForFlow(flowId);
            state.ready = false;
            state.widgetID = undefined;
            state.formData = undefined;
            if (state.loadWatchdog) {
              clearTimeout(state.loadWatchdog);
            }
            if (state.executeWatchdog) {
              clearTimeout(state.executeWatchdog);
            }
            state.loadWatchdog = undefined;
            state.executeWatchdog = undefined;
            const container = document.getElementById(`talon_container_${flowId}`);
            if (container) {
              container.parentNode.removeChild(container);
            }
            const hCaptchaCheckbox = document.getElementById(`h_captcha_checkbox_${flowId}`);
            if (hCaptchaCheckbox) {
              hCaptchaCheckbox.parentNode.removeChild(hCaptchaCheckbox);
            }
          },
          reset: function (flowId) {
            const state = getStateForFlow(flowId);
            if (state.session && state.config.onReady) {
              state.config.onReady(state.session);
            } else {
              handleError(new Error(`'attempting to reset flow_id "${flowId}" that is not initialized`), undefined);
            }
          },
          close: closeChallenge,
          debug: {
            openDialog: function (flowId) {
              toggleChallengeVisibility(getStateForFlow(flowId), true);
            },
            closeDialog: closeChallenge,
            nelly: function () {
              enableNelly = true;
              initializeNelly(["https://nelly-service-prod-cloudflare.ecosec.on.epicgames.com/v1/task", "https://nelly-service-prod-cloudfront.ecosec.on.epicgames.com/v1/task", "https://nelly-service-prod-fastly.ecosec.on.epicgames.com/v1/task", "https://nelly-service-prod-akamai.ecosec.on.epicgames.com/v1/task", "https://nelly-service-prod.ecbc.live.use1a.on.epicgames.com/v1/task"].sort(function () {
                return Math.random() - 0.5;
              }), "talon", 1).then();
            }
          },
          entry: ""
        };
        telemetryInterval ||= window.setInterval(function () {
          return sendTelemetry.apply(this, arguments);
        }, 2000);
        Object.keys(eventListeners).forEach(function (eventType) {
          window.addEventListener(eventType, function (event) {
            (function (event) {
              if (eventListeners[event.type]) {
                eventListeners[event.type].push(...processEvent(event));
              }
            })(event);
          });
        });
        initializeNelly(["https://nelly-service-prod-cloudflare.ecosec.on.epicgames.com/v1/task", "https://nelly-service-prod-cloudfront.ecosec.on.epicgames.com/v1/task", "https://nelly-service-prod-fastly.ecosec.on.epicgames.com/v1/task", "https://nelly-service-prod-akamai.ecosec.on.epicgames.com/v1/task", "https://nelly-service-prod.ecbc.live.use1a.on.epicgames.com/v1/task"].sort(function () {
          return Math.random() - 0.5;
        }), "talon", 0.05).then();
      }
    })();
  })();