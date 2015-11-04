import { assert } from 'chai';

import {
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
} from '../index';

describe('addToSet', () => {
  it('should add an element to an empty set', () => {
    const src = [];

    const sub = addToSet(src, 'a');

    assert.deepEqual(sub, ['a']);
    assert.deepEqual(src, [], 'should not modify the original');
  });

  it('should add an element to a set with another member', () => {
    const src = ['b'];

    const sub = addToSet(src, 'a');

    assert.deepEqual(sub, ['b', 'a']);
    assert.deepEqual(src, ['b'], 'should not modify the original');
  });

  it('should not add a duplicate element to a set', () => {
    const src = ['a'];

    const sub = addToSet(src, 'a');

    assert.deepEqual(sub, ['a']);
    assert.strictEqual(sub, src, 'identity should be retained');
    assert.deepEqual(src, ['a'], 'should not modify the original');
  });
});

describe('merge', () => {
  it('should merge two simple objects', () => {
    const src = {a: 'b'};
    const sub = merge(src, {x: 'y'});

    assert.deepEqual(sub, {a: 'b', x: 'y'});
    assert.deepEqual(src, {a: 'b'}, 'should not modify the original');
  });

  it('should merge two nested objects', () => {
    const src = {a: {x: 1}};
    const sub = merge(src, {a: {y: 2}});

    assert.deepEqual(sub, {a: {x: 1, y: 2}});
    assert.deepEqual(src, {a: {x: 1}}, 'should not modify the original');
  });

  it('should take no action when there are no changes to a simple object', () => {
    const src = {a: 'b'};
    const sub = merge(src, {a: 'b'});

    assert.deepEqual(sub, {a: 'b'});
    assert.strictEqual(sub, src, 'should retain the identity');
  });

  it('should take no action when there are no changes to nested objects', () => {
    const src = {a: {x: 1}};
    const sub = merge(src, {a: {x: 1}});

    assert.deepEqual(sub, {a: {x: 1}});
    assert.strictEqual(sub, src, 'should retain the identity');
  });

  it('should not merge arrays', () => {
    const src = {a: [1]};
    const sub = merge(src, {a: [2]});

    assert.deepEqual(sub, {a: [2]});
    assert.deepEqual(src, {a: [1]}, 'should not modify the original');
  });

  it('should not merge disparate class instances', () => {
    class A { constructor(x) { this.x = x; } }
    class B { constructor(y) { this.y = y; } }

    const src = {z: new A(1)};
    const sub = merge(src, {z: new B(1)});

    assert.deepEqual(src, {z: new A(1)}, 'should not modify the original');
    assert.deepEqual(sub, {z: new B(1)});
  });

  it('should not merge similar class instances', () => {
    class A {
      constructor(x, y) {
        if (x) { this.x = x; }
        if (y) { this.y = y; }
      }
    }

    const src = {z: new A(false, true)};
    const sub = merge(src, {z: new A(true, false)});

    assert.deepEqual(sub, {z: new A(true, false)});
    assert.deepEqual(src, {z: new A(false, true)}, 'should not modify the original');
  });
});
