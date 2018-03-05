const assert = require(`assert`);

module.exports = {
  assertObjectProperty(obj, ...properties) {
    for (const prop of properties) {
      assert(obj.hasOwnProperty(prop), `'${prop}' property should exist`);
    }
  },
  assertType(value, type) {
    assert(typeof value === type, `value should have ${type} type`);
  },
  assertArrayMember(array, member) {
    assert(array.includes(member), `value should be equal of one of array's element`);
  },
  assertArray(value, type) {
    assert(Array.isArray(value), `value should be Array`);
    assert(value.every((item) => (typeof item === type)), `value should be Array<${type}>`);
  },
  assertInRange(value, min, max) {
    assert(value >= min && value <= max, `value should be in a range of ${min} to ${max}`);
  }
};
