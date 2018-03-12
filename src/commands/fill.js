const {MongoClient} = require(`mongodb`);
const {generateEntities} = require(`../generate`);

const ENTITIES_COUNT = 15;
const DB_URL = process.env.DB_URL || `mongodb://localhost:27017`;
const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME || `keksobooking`;

async function fillOffers(db) {
  const offersCollection = db.collection(`offers`);
  const offers = generateEntities(ENTITIES_COUNT);

  await offersCollection.createIndex({date: -1}, {unique: true});
  await offersCollection.insertMany(offers);

  return db;
}

module.exports = {
  name: `fill`,
  args: [],
  description: `заполняет базу данных тестовыми данными`,
  async execute() {
    try {
      console.log(`Добавляем тестовые данные в '${DB_DATABASE_NAME}'...`);

      const client = await MongoClient.connect(DB_URL);
      const db = client.db(DB_DATABASE_NAME);

      await fillOffers(db);

      client.close();

      console.log(`База данных успешно заполнена тестовыми данными`);
    } catch (err) {
      console.log(err.message);
    }
  }
};
