const {generateEntities} = require(`../src/generate`);

const ENTITIES_COUNT = 30;
const entities = generateEntities(ENTITIES_COUNT);

class MockOffers {
  constructor() {
    this._bucket = new MockBucket();
  }

  async get(skip = 0, limit = 0) {
    return entities.slice(skip, skip + limit);
  }

  async getByDate(date) {
    return entities.find((item) => item.date === date);
  }

  async insert(offer) {
    return entities.push(offer);
  }

  async count() {
    return ENTITIES_COUNT;
  }

  get files() {
    return this._bucket;
  }
}

class MockBucket {
  constructor() {
  }

  async getInfo() {
    return null;
  }

  async get() {
    return null;
  }

  async put() {
    return null;
  }
}

const offers = new MockOffers();

module.exports = {
  get offers() {
    return offers;
  },
};
