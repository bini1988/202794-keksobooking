const offers = require(`../models/offers`);
const {ValidationError, NotFoundError} = require(`./errors`);
const {isUnsignedInteger} = require(`./utils`);

const DEFAULT_ITEMS_SKIP = 0;
const DEFAULT_ITEMS_LIMIT = 20;

function validateQuery(query) {
  const error = new ValidationError();
  const {skip, limit} = query;

  if (skip && !isUnsignedInteger(skip)) {
    error.add(`skip`, `Expect positive integer`);
  }

  if (limit && !isUnsignedInteger(limit)) {
    error.add(`limit`, `Expect positive integer`);
  }

  if (!error.isEmpty) {
    throw error;
  }
}

module.exports = {
  get(req, res) {
    validateQuery(req.query);

    let {skip, limit} = req.query;

    skip = (skip) ? parseInt(skip, 10) : DEFAULT_ITEMS_SKIP;
    limit = (limit) ? parseInt(limit, 10) : DEFAULT_ITEMS_LIMIT;

    const data = offers.get(skip, limit);
    const total = data.length;

    res.status(200).json({data, skip, limit, total});
  },
  getByDate(req, res) {
    const date = parseInt(req.params.date, 10);
    const offer = offers.getByDate(date);

    if (!offer) {
      const error = new NotFoundError();
      throw error.add(`Offer with date '${req.params.date}' is not found`);
    }

    res.status(200).json(offer);
  },
  post(req, res) {
    const offer = req.body;

    if (req.files && req.files.avatar) {
      offer.avatar = req.files.avatar[0];
    }

    if (req.files && req.files.preview) {
      offer.preview = req.files.preview[0];
    }

    offers.add(offer);

    res.status(200).json(offer);
  },
};
