// @flow

export function append<T>(arr: ?Array<T>, ...e: Array<T>): Array<T> {
  return (arr || []).concat(e);
}

export function merge<Object>(obj: Object, src: Object): Object {
  let res = obj;

  const keys = Object.keys(src);

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];

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
}

export function getIn<T>(obj: Object, path: Array<string>, notSetValue: T): T|any {
  let r = obj || {};

  for (let i = 0; i < path.length; i++) {
    const k = path[i];

    if (i < path.length - 1) {
      if (typeof r !== 'object' || r === null || r.constructor !== Object) {
        throw new Error(`encountered non-object value at ${k} via ${path.join('.')}`);
      }
    }

    r = r[k];
  }

  return typeof r === 'undefined' ? notSetValue : r;
}

function setAndRefine(obj: Object, key: string, value: any): Object {
  const res = Object.assign({}, obj);
  res[key] = value;
  return res;
}

export function updateIn<T>(obj: Object, path: Array<string>, notSetValue: T, updater: (x: T) => T): Object {
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

  return setAndRefine(obj, path[0], r);
}

export function setIn<T>(obj: Object, path: Array<string>, value: T): Object {
  return updateIn(obj, path, null, () => value);
}

export function mergeIn<T>(obj: Object, path: Array<string>, data: T): Object {
  return updateIn(obj, path, {}, (value) => merge(value, data));
}

export function addToSet<T>(arr: Array<T>, ...e: Array<T>): Array<T> {
  return e.reduce((a, v) => {
    return a.indexOf(v) === -1 ? append(a, v) : a;
  }, arr)
}

export function before<T>(arr: Array<T>, index: number): Array<T> {
  return arr.slice(0, index);
}

export function after<T>(arr: Array<T>, index: number): Array<T> {
  return arr.slice(index);
}

export function insertAt<T>(arr: Array<T>, index: number, data: T): Array<T> {
  return append(append(before(arr, index), data), ...after(arr, index));
}

export function replaceAt<T>(arr: Array<T>, index: number, data: T): Array<T> {
  if (arr[index] === data) {
    return arr;
  }

  return append(append(before(arr, index), data), ...after(arr, index + 1));
}

export function removeAt<T>(arr: Array<T>, index: number): Array<T> {
  return append(before(arr, index), ...after(arr, index + 1));
}
