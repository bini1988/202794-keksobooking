const express = require(`express`);
const bodyParser = require(`body-parser`);
const routes = require(`./routes`);

const STATIC_FOLDER = `static`;
const HOST_NAME = `127.0.0.1`;
const PORT = 3000;

const app = express();

app.use(express.static(STATIC_FOLDER));
app.use(bodyParser.json());

routes(app);

module.exports = {
  app,
  run(args) {
    const [port = PORT] = args;

    app.listen(port, HOST_NAME, () => {
      console.log(`[i] Server was successfully started at ${HOST_NAME}:${port}`);
    });
  }
};
