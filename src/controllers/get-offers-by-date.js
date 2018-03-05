const offers = require(`../models/offers`);
const {NotFoundError} = require(`./errors`);

function getOffersByDate(req, res) {
  const date = parseInt(req.params.date, 10);
  const offer = offers.getByDate(date);

  if (!offer) {
    const error = new NotFoundError();
    throw error.add(`Offer with date '${req.params.date}' is not found`);
  }

  res.status(200).json(offer);
}

module.exports = [
  getOffersByDate,
];
