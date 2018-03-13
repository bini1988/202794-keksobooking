const {MongoClient, GridFSBucket} = require(`mongodb`);
const Offers = require(`./offers`);
const Bucket = require(`./bucket`);

let offers = null;

const setupOffers = (db) => {
  const fsBucket = new GridFSBucket(db, {chunkSizeBytes: 1024, bucketName: `files`});
  const offersCollection = db.collection(`offers`);

  offersCollection.createIndex({date: -1}, {unique: true});

  offers = new Offers(offersCollection, new Bucket(fsBucket));

  return db;
};

module.exports = {
  get offers() {
    return offers;
  },
  async init({url, dbName}) {

    const client = await MongoClient.connect(url);

    const db = client.db(dbName);

    setupOffers(db);
  },
};
