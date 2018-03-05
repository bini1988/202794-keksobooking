const {ValidationError, NotFoundError} = require(`../controllers/errors`);

function handle404Error() {
  const error = new NotFoundError();
  throw error.add(`Resourse not found`);
}

function handleErrors(err, req, res, _next) {
  console.error(`[e] Error: ${err.message}`);

  if (err instanceof ValidationError) {
    res.status(400).json(err.errors);
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json(err.errors);
    return;
  }

  res.status(500).json([{
    error: `Internal Error`,
    errorMessage: `Server has fallen into unrecoverable problem.`
  }]);
}

module.exports = {
  handleErrors,
  handle404Error,
};
