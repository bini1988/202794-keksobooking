const logger = require(`../services/logger`);

function log(req, res, next) {
  const {method, url} = req;
  logger.info(`[${method}] ${url}`);
  next();
}

module.exports = log;
