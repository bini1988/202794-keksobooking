const express = require(`express`);
const multer = require(`multer`);
const getOffers = require(`./get-offer`);
const getOfferByDate = require(`./get-offer-by-date`);
const getOfferAvatar = require(`./get-offer-avatar`);
const getOfferPreview = require(`./get-offer-preview`);
const postOffer = require(`./post-offer`);

const upload = multer({storage: multer.memoryStorage()});
const offerUpload = upload.fields([
  {name: `avatar`, maxCount: 1},
  {name: `preview`, maxCount: 1}
]);

const router = express.Router(); // eslint-disable-line new-cap

router.get(`/offers`, getOffers);
router.post(`/offers`, offerUpload, postOffer);
router.get(`/offers/:date`, getOfferByDate);
router.get(`/offers/:date/avatar`, getOfferAvatar);
router.get(`/offers/:date/preview`, getOfferPreview);

module.exports = router;
