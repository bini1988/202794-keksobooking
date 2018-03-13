const logger = require(`./services/logger`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const CORSMiddleware = require(`./services/cors`);
const routes = require(`./routes`);
const models = require(`./models`);

const STATIC_FOLDER = process.env.SERVER_STATIC_FOLDER || `static`;
const HOST_NAME = process.env.SERVER_HOST || `127.0.0.1`;
const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;

const DB_URL = process.env.DB_URL || `mongodb://localhost:27017`;
const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME || `keksobooking`;

const app = express();

app.set(`views`, `./src/server/views`);
app.set(`view engine`, `ejs`);

app.use(express.static(STATIC_FOLDER));
app.use(bodyParser.json());
app.use(CORSMiddleware);

routes(app);

module.exports = {
  app,
  async run(args) {
    const [port = PORT] = args;

    try {
      await models.init({url: DB_URL, dbName: DB_DATABASE_NAME});

      app.locals.models = models;

      logger.info(`Create db connection with ${DB_URL} and init models`);
    } catch (err) {
      logger.error(`Failed to connect to MongoDB`, err);
      process.exit(1);
    }

    app.listen(port, HOST_NAME, () => {
      logger.info(`Server was successfully started at ${HOST_NAME}:${port}`);
    });
  }
};
