// @flow

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.append = append;
exports.merge = merge;
exports.getIn = getIn;
exports.updateIn = updateIn;
exports.setIn = setIn;
exports.mergeIn = mergeIn;
exports.addToSet = addToSet;
exports.before = before;
exports.after = after;
exports.insertAt = insertAt;
exports.replaceAt = replaceAt;
exports.removeAt = removeAt;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function append /*:: <T>*/(arr /*: ?Array<T>*/) /*: Array<T>*/ {
  for (var _len = arguments.length, e = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    e[_key - 1] = arguments[_key];
  }

  return (arr || []).concat(e);
}

function merge /*:: <A, B>*/(obj /*: A*/, src /*: B*/) /*: A|B*/ {
  if (typeof obj !== 'object' || obj === null || obj.constructor && obj.constructor !== Object) {
    throw new Error('obj must be a plain; instead was ' + typeof obj);
  }

  if (typeof src !== 'object' || src === null || obj.constructor && src.constructor !== Object) {
    throw new Error('src must be a plain; instead was ' + typeof src);
  }

  var res = obj;

  var keys = Object.keys(src);

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];

    if (res[k] === src[k]) {
      continue;
    }

    if (typeof src[k] === 'object' && src[k] !== null && (!src[k].constructor || src[k].constructor === Object)) {
      var sub = res[k];

      if (typeof sub !== 'object' || sub === null || !sub.constructor || sub.constructor !== Object) {
        sub = {};
      }

      var out = merge(sub, src[k]);

      if (out === res[k]) {
        continue;
      }

      if (res === obj) {
        res = _extends({}, obj);
      }

      res[k] = out;
    } else {
      if (res === obj) {
        res = _extends({}, obj);
      }

      res[k] = src[k];
    }
  }

  return res;
}

function getIn /*:: <T>*/(obj /*: Object*/, path /*: Array<string>*/, notSetValue /*: T*/) /*: T|any*/ {
  var r = obj || {};

  for (var i = 0; i < path.length; i++) {
    var k = path[i];

    if (i < path.length - 1) {
      if (typeof r !== 'object' || r === null || r.constructor !== Object) {
        throw new Error('encountered non-object value at ' + k + ' via ' + path.join('.'));
      }
    }

    r = r[k];
  }

  return typeof r === 'undefined' ? notSetValue : r;
}

function setAndRefine /*:: <T>*/(obj /*: T*/, key /*: string*/, value /*: any*/) /*: T*/ {
  if (typeof obj !== 'object' || obj === null || obj.constructor !== Object) {
    throw new Error('encountered non-object');
  }

  if (obj[key] === value) {
    return obj;
  }

  return Object.assign({}, obj, _defineProperty({}, key, value));
}

function updateIn /*:: <T>*/(obj /*: Object*/, path /*: Array<string>*/, notSetValue /*: T*/, updater /*: (x: T) => T*/) /*: Object*/ {
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

  return setAndRefine(obj, path[0], r);
}

function setIn /*:: <T>*/(obj /*: Object*/, path /*: Array<string>*/, value /*: T*/) /*: Object*/ {
  return updateIn(obj, path, null, function () {
    return value;
  });
}

function mergeIn /*:: <T>*/(obj /*: Object*/, path /*: Array<string>*/, data /*: T*/) /*: Object*/ {
  return updateIn(obj, path, {}, function (value) {
    return merge(value, data);
  });
}

function addToSet /*:: <T>*/(arr /*: Array<T>*/) /*: Array<T>*/ {
  for (var _len2 = arguments.length, e = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    e[_key2 - 1] = arguments[_key2];
  }

  return e.reduce(function (a, v) {
    return a.indexOf(v) === -1 ? append(a, v) : a;
  }, arr);
}

function before /*:: <T>*/(arr /*: Array<T>*/, index /*: number*/) /*: Array<T>*/ {
  return arr.slice(0, index);
}

function after /*:: <T>*/(arr /*: Array<T>*/, index /*: number*/) /*: Array<T>*/ {
  return arr.slice(index);
}

function insertAt /*:: <T>*/(arr /*: Array<T>*/, index /*: number*/, data /*: T*/) /*: Array<T>*/ {
  return append.apply(undefined, [append(before(arr, index), data)].concat(_toConsumableArray(after(arr, index))));
}

function replaceAt /*:: <T>*/(arr /*: Array<T>*/, index /*: number*/, data /*: T*/) /*: Array<T>*/ {
  if (arr[index] === data) {
    return arr;
  }

  return append.apply(undefined, [append(before(arr, index), data)].concat(_toConsumableArray(after(arr, index + 1))));
}

function removeAt /*:: <T>*/(arr /*: Array<T>*/, index /*: number*/) /*: Array<T>*/ {
  return append.apply(undefined, [before(arr, index)].concat(_toConsumableArray(after(arr, index + 1))));
}