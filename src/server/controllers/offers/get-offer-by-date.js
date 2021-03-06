const {NotFoundError} = require(`../../services/errors`);
const {asyncMiddleware} = require(`../../services/utils`);

module.exports = asyncMiddleware(async (req, res) => {
  const date = parseInt(req.params.date, 10);
  const models = req.app.locals.models;
  const offer = await models.offers.getByDate(date);

  if (!offer) {
    const error = new NotFoundError();
    throw error.add(`Offer with date '${req.params.date}' is not found`);
  }

  res.status(200).json(offer);
});
