const express = require(`express`);
const bodyParser = require(`body-parser`);
const routes = require(`./routes`);
const models = require(`./models`);

const STATIC_FOLDER = `static`;
const HOST_NAME = `127.0.0.1`;
const PORT = 3000;

const DB_URL = `mongodb://localhost:27017`;
const DB_DATABASE_NAME = `keksobooking`;

const app = express();

app.use(express.static(STATIC_FOLDER));
app.use(bodyParser.json());

routes(app);

module.exports = {
  app,
  async run(args) {
    const [port = PORT] = args;

    try {
      await models.init({url: DB_URL, dbName: DB_DATABASE_NAME});

      app.locals.models = models;

      console.log(`[i] Create db connection with ${DB_URL} and init models`);
    } catch (err) {
      console.error(`[e] Failed to connect to MongoDB`, err);
      process.exit(1);
    }

    app.listen(port, HOST_NAME, () => {
      console.log(`[i] Server was successfully started at ${HOST_NAME}:${port}`);
    });
  }
};
