const express = require(`express`);

const STATIC_FOLDER = `static`;
const HOST_NAME = `127.0.0.1`;
const PORT = 3000;

const app = express();

app.use(express.static(STATIC_FOLDER));

app.get(`/`, function (req, res) {
  res.send(`Hello World!`);
});

module.exports = {
  run(args) {
    const [port = PORT] = args;

    app.listen(port, HOST_NAME, () => {
      console.log(`[i] Server was successfully started at ${HOST_NAME}:${port}`);
    });
  }
};
