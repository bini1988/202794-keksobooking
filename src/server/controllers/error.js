const {ValidationError, NotFoundError} = require(`../services/errors`);


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
  index: handleErrors,
};
