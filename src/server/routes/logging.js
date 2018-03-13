const logger = require(`../services/logger`);

module.exports = (req, res, next) => {
  const {method, url} = req;
  logger.info(`[${method}] ${url}`);
  next();
};
