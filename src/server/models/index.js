const {MongoClient, GridFSBucket} = require(`mongodb`);
const Offers = require(`./offers`);
const Bucket = require(`./bucket`);

let offers = null;

function setupOffers(db) {
  const fsBucket = new GridFSBucket(db, {chunkSizeBytes: 1024, bucketName: `files`});
  const offersCollection = db.collection(`offers`);

  offersCollection.createIndex({date: -1}, {unique: true});

  offers = new Offers(offersCollection, new Bucket(fsBucket));

  return db;
}

module.exports = {
  init(config) {
    return MongoClient.connect(config.url)
        .then((client) => client.db(config.dbName))
        .then(setupOffers);
  },
  get offers() {
    return offers;
  },
};
