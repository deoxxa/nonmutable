'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var append = function append(arr) {
  for (var _len = arguments.length, e = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    e[_key - 1] = arguments[_key];
  }

  return (arr || []).concat(e);
};

var merge = function merge(obj, src) {
  var res = obj;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(src)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var k = _step.value;

      if (res[k] === src[k]) {
        continue;
      }

      if (typeof src[k] === 'object' && src[k] !== null && src[k].constructor === Object) {
        var sub = res[k];

        if (typeof sub !== 'object' || sub === null || sub.constructor !== Object) {
          sub = {};
        }

        var out = merge(sub, src[k]);

        if (out === res[k]) {
          continue;
        }

        if (res === obj) {
          res = Object.assign({}, obj);
        }

        res[k] = out;
      } else {
        if (res === obj) {
          res = Object.assign({}, obj);
        }

        res[k] = src[k];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return res;
};

var getIn = function getIn(obj, path, notSetValue) {
  var r = obj || {};

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = path[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var k = _step2.value;

      if (typeof r !== 'object' || r === null || r.constructor !== Object) {
        throw new Error('encountered non-object value at ' + k + ' via ' + path.join('.'));
      }

      r = r[k];
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return typeof r === 'undefined' ? notSetValue : r;
};

var updateIn = function updateIn(obj, path, notSetValue, updater) {
  if (typeof obj !== 'object' || obj === null || obj.constructor !== Object) {
    throw new Error('encountered non-object');
  }

  var r = null;

  if (path.length === 1) {
    if (typeof obj[path[0]] === 'undefined') {
      r = updater(notSetValue);
    } else {
      r = updater(obj[path[0]]);
    }
  } else {
    if (typeof obj[path[0]] === 'undefined') {
      r = updateIn({}, path.slice(1), notSetValue, updater);
    } else {
      r = updateIn(obj[path[0]], path.slice(1), notSetValue, updater);
    }
  }

  if (r === obj[path[0]]) {
    return obj;
  }

  return Object.assign({}, obj, _defineProperty({}, path[0], r));
};

var setIn = function setIn(obj, path, value) {
  return updateIn(obj, path, null, function () {
    return value;
  });
};

var mergeIn = function mergeIn(obj, path, data) {
  return updateIn(obj, path, {}, function (value) {
    return merge(value, data);
  });
};

var addToSet = function addToSet(arr) {
  for (var _len2 = arguments.length, e = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    e[_key2 - 1] = arguments[_key2];
  }

  return e.reduce(function (a, v) {
    return a.indexOf(v) === -1 ? append(a, v) : a;
  }, arr);
};

var before = function before(arr, index) {
  return arr.slice(0, index);
};
var after = function after(arr, index) {
  return arr.slice(index);
};

var insertAt = function insertAt(arr, index, data) {
  return append.apply(undefined, [append(before(arr, index), data)].concat(_toConsumableArray(after(arr, index))));
};

var replaceAt = function replaceAt(arr, index, data) {
  return append.apply(undefined, [append(before(arr, index), data)].concat(_toConsumableArray(after(arr, index + 1))));
};

var removeAt = function removeAt(arr, index) {
  return append.apply(undefined, [before(arr, index)].concat(_toConsumableArray(after(arr, index + 1))));
};

exports['default'] = {
  addToSet: addToSet,
  after: after,
  append: append,
  before: before,
  getIn: getIn,
  insertAt: insertAt,
  merge: merge,
  mergeIn: mergeIn,
  removeAt: removeAt,
  replaceAt: replaceAt,
  setIn: setIn,
  updateIn: updateIn
};
module.exports = exports['default'];