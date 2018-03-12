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

  if (!offer.preview) {
    const error = new NotFoundError();
    throw error.add(`Offer with date '${req.params.date}' does not have preview`);
  }

  const info = await models.offers.files.getInfo(offer.preview.path);

  if (!info) {
    const error = new NotFoundError();
    throw error.add(`Preview of offer with date '${req.params.date}' does not found`);
  }

  res.set(`Content-Type`, offer.preview.mimetype);
  res.set(`Content-Length`, info.length);
  res.status(200);

  const stream = await models.offers.files.get(offer.preview.path);

  stream.pipe(res);
});
