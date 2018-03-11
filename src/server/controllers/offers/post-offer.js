const offers = require(`../../models/offers`);
const {asyncMiddleware} = require(`../../services/utils`);
const {validate} = require(`./validate-offer`);

module.exports = asyncMiddleware(async (req, res) => {
  const offer = req.body;

  if (req.files && req.files.avatar) {
    offer.avatar = req.files.avatar[0];
  }

  if (req.files && req.files.preview) {
    offer.preview = req.files.preview[0];
  }

  offers.add(validate(offer));

  res.status(200).json(offer);
});
