const assert = require(`assert`);

module.exports = {
  assertObjectProperty(obj, property, message) {
    assert(obj.hasOwnProperty(property), message || `'${property}' property should exist`);
  },
  assertType(value, type, message) {
    assert(typeof value === type, message || `value should have ${type} type`);
  },
  assertArrayMember(array, member) {
    assert(array.includes(member), `value should be equal of one of array's element`);
  },
  assertArray(value, type, message) {
    assert(Array.isArray(value), message || `value should be Array`);
    assert(value.every((item) => (typeof item === type)), message || `value should be Array<${type}>`);
  },
  assertInRange(value, min, max) {
    assert(value >= min && value <= max, `value should be in a range of ${min} to ${max}`);
  }
};
