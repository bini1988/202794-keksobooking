
class Offers {
  constructor(collection, bucket) {
    this._collection = collection;
    this._bucket = bucket;
  }

  get files() {
    return this._bucket;
  }

  async get(skip = 0, limit = 0) {
    return await this._collection
        .find({}, {skip, limit})
        .toArray();
  }

  async getByDate(date) {
    const offers = await this._collection
        .find({date})
        .toArray();

    return offers[0];
  }

  async insert(offer) {
    return await this._collection
        .insertOne(offer);
  }

  async count() {
    return await this._collection
        .count({});
  }
}

module.exports = Offers;
