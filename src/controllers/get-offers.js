const offers = require(`../models/offers`);
const {ValidationError} = require(`./errors`);

const DEFAULT_ITEMS_SKIP = 0;
const DEFAULT_ITEMS_LIMIT = 20;

function isUnsignedInteger(value) {
  const number = parseInt(value, 10);
  return (Number.isInteger(number) && number >= 0);
}

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

function getOffers(req, res) {
  validateQuery(req.query);

  let {skip, limit} = req.query;

  skip = (skip) ? parseInt(skip, 10) : DEFAULT_ITEMS_SKIP;
  limit = (limit) ? parseInt(limit, 10) : DEFAULT_ITEMS_LIMIT;

  const data = offers.get(skip, limit);
  const total = data.length;

  res.status(200).json({data, skip, limit, total});
}

module.exports = [
  getOffers,
];
