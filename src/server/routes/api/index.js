const express = require(`express`);
const offersController = require(`../../controllers/offers`);

const router = express.Router(); // eslint-disable-line new-cap

router.use(`/api`, offersController);

module.exports = router;
