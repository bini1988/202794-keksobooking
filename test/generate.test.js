const assert = require(`assert`);
const {
  assertObjectProperty,
  assertType,
  assertArrayMember,
  assertArray,
  assertInRange
} = require(`./utils`);

const {generateEntity} = require(`../src/generate/generate`);
const locationFactory = require(`../src/generate/location`);
const offerFactory = require(`../src/generate/offer`);

function getEntities() {
  const entities = [];
  const titlesCount = offerFactory.options.titles.length;

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
      assertArrayMember(offerFactory.options.titles, offer.title);

      const titlesCount = offerFactory.options.titles.length;
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

      const {min, max} = offerFactory.options.price;
      assertInRange(offer.price, min, max);
    });

    it(`should have valid 'type' property`, () => {
      assertObjectProperty(offer, `type`);
      assertType(offer.type, `string`);
      assertArrayMember(offerFactory.options.types, offer.type);
    });

    it(`should have valid 'rooms' property`, () => {
      assertObjectProperty(offer, `rooms`);
      assertType(offer.rooms, `number`);

      const {min, max} = offerFactory.options.rooms;
      assertInRange(offer.rooms, min, max);
    });

    it(`should have valid 'guests' property`, () => {
      assertObjectProperty(offer, `guests`);
      assertType(offer.guests, `number`);

      const {min, max} = offerFactory.options.guests;
      assertInRange(offer.guests, min, max);
    });

    it(`should have valid 'checkin' property`, () => {
      assertObjectProperty(offer, `checkin`);
      assertType(offer.checkin, `string`);
      assertArrayMember(offerFactory.options.checkin, offer.checkin);
    });

    it(`should have valid 'checkout' property`, () => {
      assertObjectProperty(offer, `checkout`);
      assertType(offer.checkout, `string`);
      assertArrayMember(offerFactory.options.checkout, offer.checkout);
    });

    it(`should have valid 'features' property`, () => {
      assertObjectProperty(offer, `features`);
      assertArray(offer.features, `string`);

      const unequalLength = (item) => (item.offer.features.length !== offer.features.length);
      assert(entities.some(unequalLength), `length of 'features' array should be random`);

      const featuresSet = new Set(offer.features);
      const featuresCount = offer.features.length;
      assert(featuresSet.size === featuresCount || featuresCount === 1, `elements of 'features' array should be unique`);
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
        assertArrayMember(offerFactory.options.photos, photo);
      }

      const unequalToEntity = (item) => (item.offer.photos.join() !== offer.photos.join());
      assert(entities.some(unequalToEntity), `elements order of 'photos' array should be random`);
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

      const {min, max} = locationFactory.options.x;
      assertInRange(location.x, min, max);
    });

    it(`should have valid 'y' property`, () => {
      assertObjectProperty(location, `y`);
      assertType(location.y, `number`);

      const {min, max} = locationFactory.options.y;
      assertInRange(location.y, min, max);
    });
  });
});
