const {ValidationError} = require(`../../services/errors`);
const {isUnsignedInteger, asyncMiddleware} = require(`../../services/utils`);

const DEFAULT_ITEMS_SKIP = 0;
const DEFAULT_ITEMS_LIMIT = 20;

const validateQuery = (query) => {
  const error = new ValidationError();
  const {skip, limit} = query;

  if (skip && !isUnsignedInteger(skip)) {
    error.add(`skip`, `Expect positive integer`);
  }

  if (limit && !isUnsignedInteger(limit)) {
    error.add(`limit`, `Expect positive integer`);
  }

  if (error.hasErrors) {
    throw error;
  }
};

module.exports = asyncMiddleware(async (req, res) => {
  const models = req.app.locals.models;

  validateQuery(req.query);

  let {skip, limit} = req.query;

  skip = (skip) ? parseInt(skip, 10) : DEFAULT_ITEMS_SKIP;
  limit = (limit) ? parseInt(limit, 10) : DEFAULT_ITEMS_LIMIT;

  const data = await models.offers.get(skip, limit);
  const total = await models.offers.count();

  res.status(200).json({data, skip, limit, total});
});
