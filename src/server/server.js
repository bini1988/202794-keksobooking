const express = require(`express`);
const bodyParser = require(`body-parser`);
const {handleErrors, handle404Error} = require(`./handle-errors`);
const getOffersController = require(`../controllers/get-offers`);
const postOffersController = require(`../controllers/post-offers`);
const getOffersByDateController = require(`../controllers/get-offers-by-date`);

const STATIC_FOLDER = `static`;
const HOST_NAME = `127.0.0.1`;
const PORT = 3000;

const app = express();

app.use(express.static(STATIC_FOLDER));
app.use(bodyParser.json());

app.get(`/api/offers`, ...getOffersController);
app.post(`/api/offers`, ...postOffersController);
app.get(`/api/offers/:date`, ...getOffersByDateController);

app.use(handle404Error);
app.use(handleErrors);

module.exports = {
  app,
  run(args) {
    const [port = PORT] = args;

    app.listen(port, HOST_NAME, () => {
      console.log(`[i] Server was successfully started at ${HOST_NAME}:${port}`);
    });
  }
};
