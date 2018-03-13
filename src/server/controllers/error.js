const logger = require(`../services/logger`);
const {ValidationError, NotFoundError} = require(`../services/errors`);

const handleErrors = (err, req, res, _next) => {
  logger.info(`Request error: ${err}`);

  if (err instanceof ValidationError) {
    if (req.accepts(`text/html`)) {
      res.status(400).render(`error`, {errors: err.errors});
      return;
    }
    res.status(400).json(err.errors);
    return;
  }

  if (err instanceof NotFoundError) {
    if (req.accepts(`text/html`)) {
      res.status(404).render(`404`);
      return;
    }
    res.status(404).json(err.errors);
    return;
  }

  if (req.accepts(`text/html`)) {
    res.status(500).render(`500`);
    return;
  }

  res.status(500).json([{
    error: `Internal Error`,
    errorMessage: `Server has fallen into unrecoverable problem.`
  }]);
};

module.exports = {
  index: handleErrors,
};
