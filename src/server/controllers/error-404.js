const logger = require(`../services/logger`);
const {NotFoundError} = require(`../services/errors`);

function handleError(req) {
  const {method, url} = req;
  logger.info(`Not found: [${method}] ${url}`);

  const error = new NotFoundError();
  throw error.add(`Resourse not found`);
}

module.exports = {
  index: handleError,
};
