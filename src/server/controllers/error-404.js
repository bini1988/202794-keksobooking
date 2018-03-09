const {NotFoundError} = require(`../services/errors`);

function handleError() {
  const error = new NotFoundError();
  throw error.add(`Resourse not found`);
}

module.exports = {
  index: handleError,
};
