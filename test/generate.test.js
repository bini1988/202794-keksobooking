const assert = require(`assert`);
const {generateEntity, options} = require(`../src/generate`);

function assertObjectProperty(obj, property, message) {
  assert(obj.hasOwnProperty(property), message || `'${property}' property should exist`);
}

function assertType(value, type, message) {
  assert(typeof value === type, message || `value should have ${type} type`);
}

function assertArrayMember(array, member) {
  assert(array.includes(member), `value should be equal of one of array's element`);
}

function assertArray(value, type, message) {
  assert(Array.isArray(value), message || `value should be Array`);
  assert(value.every((item) => typeof item === `string`), message || `value should be Array<${type}>`);
}

function assertInRange(value, min, max) {
  assert(value >= min && value <= max, `value should be in a range of ${min} to ${max}`);
}

function getEntities() {
  const entities = [];
  const titlesCount = options.offer.titles.length;

  for (let index = 0; index < titlesCount; index++) {
    entities.push(generateEntity());
  }

  return entities;
}

describe(`generateEntity`, () => {
  const entities = getEntities();
  const [entity] = entities;

  describe(`Return result`, () => {
    it(`should be object`, () => {
      assertType(entity, `object`);
    });

    it(`should have given shape`, () => {
      assertObjectProperty(entity, `author`);
      assertObjectProperty(entity, `offer`);
      assertObjectProperty(entity, `location`);
    });
  });

  describe(`Author property of return result`, () => {
    const {author} = entity;

    it(`should be object`, () => {
      assertType(author, `object`);
    });

    it(`should have valid 'avatar' property`, () => {
      assertObjectProperty(author, `avatar`);
      assertType(author.avatar, `string`);

      const URL_REGEXP = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
      assert(URL_REGEXP.test(author.avatar), `value of 'avatar' property should be URL`);
    });
  });

  describe(`Offer property of return result`, () => {
    const {offer} = entity;

    it(`should be object`, () => {
      assertType(offer, `object`);
    });

    it(`should have valid 'title' property`, () => {
      assertObjectProperty(offer, `title`);
      assertType(offer.title, `string`);
      assertArrayMember(options.offer.titles, offer.title);

      const titlesCount = options.offer.titles.length;
      assert((new Set(entities)).size === titlesCount, `values of 'title' should be unique`);
    });

    it(`should have valid 'address' property`, () => {
      assertObjectProperty(offer, `address`);
      assertType(offer.address, `string`);

      const ADDRESS = `${entity.location.x}, ${entity.location.y}`;
      assert(offer.address === ADDRESS, `value of 'address' property should be in format of '{{location.x}}, {{location.y}}'`);
    });

    it(`should have valid 'price' property`, () => {
      assertObjectProperty(offer, `price`);
      assertType(offer.price, `number`);

      const {min, max} = options.offer.price;
      assertInRange(offer.price, min, max);
    });

    it(`should have valid 'type' property`, () => {
      assertObjectProperty(offer, `type`);
      assertType(offer.type, `string`);
      assertArrayMember(options.offer.types, offer.type);
    });

    it(`should have valid 'rooms' property`, () => {
      assertObjectProperty(offer, `rooms`);
      assertType(offer.rooms, `number`);

      const {min, max} = options.offer.rooms;
      assertInRange(offer.rooms, min, max);
    });

    it(`should have valid 'guests' property`, () => {
      assertObjectProperty(offer, `guests`);
      assertType(offer.guests, `number`);

      const {min, max} = options.offer.guests;
      assertInRange(offer.guests, min, max);
    });

    it(`should have valid 'checkin' property`, () => {
      assertObjectProperty(offer, `checkin`);
      assertType(offer.checkin, `string`);
      assertArrayMember(options.offer.checkin, offer.checkin);
    });

    it(`should have valid 'checkout' property`, () => {
      assertObjectProperty(offer, `checkout`);
      assertType(offer.checkout, `string`);
      assertArrayMember(options.offer.checkout, offer.checkout);
    });

    it(`should have valid 'features' property`, () => {
      assertObjectProperty(offer, `features`);
      assertArray(offer.features, `string`);

      const unequalLength = (item) => (item.length !== entity.length);
      assert(entities.some(unequalLength), `length of 'features' array should be random`);
      assert((new Set(offer.features)).size === offer.features, `elements of 'features' array should be unique`);
    });

    it(`should have valid 'description' property`, () => {
      assertObjectProperty(offer, `description`);
      assertType(offer.description, `string`);
      assert(offer.description.length === 0, `value of 'description' property should be empty string`);
    });

    it(`should have valid 'photos' property`, () => {
      assertObjectProperty(offer, `photos`);
      assertArray(offer.photos, `string`);

      for (const photo of offer.photos) {
        assertArrayMember(options.offer.photos, photo);
      }

      const unequalOrder = (item) => (item.join() !== entity.join());
      assert(entities.some(unequalOrder), `elements order of 'photos' array should be random`);
    });
  });

  describe(`Location property of return result`, () => {
    const {location} = entity;

    it(`should be object`, () => {
      assertType(location, `object`);
    });

    it(`should have valid 'x' property`, () => {
      assertObjectProperty(location, `x`);
      assertType(location.x, `number`);

      const {min, max} = options.location.x;
      assertInRange(location.x, min, max);
    });

    it(`should have valid 'y' property`, () => {
      assertObjectProperty(location, `y`);
      assertType(location.y, `number`);

      const {min, max} = options.location.y;
      assertInRange(location.y, min, max);
    });
  });
});
