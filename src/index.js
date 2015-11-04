const append = (arr, ...e) => (arr || []).concat(e);

const merge = (obj, src) => {
  let res = obj;

  for (let k of Object.keys(src)) {
    if (res[k] === src[k]) {
      continue;
    }

    if (typeof src[k] === 'object' && src[k] !== null && src[k].constructor === Object) {
      let sub = res[k];

      if (typeof sub !== 'object' || sub === null || sub.constructor !== Object) {
        sub = {};
      }

      const out = merge(sub, src[k]);

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

  return res;
};

const getIn = (obj, path, notSetValue) => {
  let r = obj || {};

  for (let k of path) {
    if (typeof r !== 'object' || r === null || r.constructor !== Object) {
      throw new Error(`encountered non-object value at ${k} via ${path.join('.')}`);
    }

    r = r[k];
  }

  return typeof r === 'undefined' ? notSetValue : r;
};

const updateIn = (obj, path, notSetValue, updater) => {
  if (typeof obj !== 'object' || obj === null || obj.constructor !== Object) {
    throw new Error(`encountered non-object`);
  }

  let r = null;

  if (path.length === 1) {
    if (typeof obj[path[0]] === 'undefined') {
      r = updater(notSetValue);
    } else {
      r = updater(obj[path[0]]);
    }
  } else {
    if (typeof obj[path[0]] === 'undefined') {
      r = updateIn({}, path.slice(1), notSetValue, updater)
    } else {
      r = updateIn(obj[path[0]], path.slice(1), notSetValue, updater)
    }
  }

  if (r === obj[path[0]]) {
    return obj;
  }

  return Object.assign({}, obj, {
    [path[0]]: r,
  });
};

const setIn = (obj, path, value) => {
  return updateIn(obj, path, null, () => value);
};

const mergeIn = (obj, path, data) => {
  return updateIn(obj, path, {}, (value) => merge(value, data));
};

const addToSet = (arr, ...e) => e.reduce((a, v) => {
  return a.indexOf(v) === -1 ? append(a, v) : a;
}, arr);

const before = (arr, index) => arr.slice(0, index);
const after = (arr, index) => arr.slice(index);

const insertAt = (arr, index, data) => {
  return append(append(before(arr, index), data), ...after(arr, index));
};

const replaceAt = (arr, index, data) => {
  return append(append(before(arr, index), data), ...after(arr, index + 1));
};

const removeAt = (arr, index) => {
  return append(before(arr, index), ...after(arr, index + 1));
};

export default {
  addToSet,
  after,
  append,
  before,
  getIn,
  insertAt,
  merge,
  mergeIn,
  removeAt,
  replaceAt,
  setIn,
  updateIn,
};
