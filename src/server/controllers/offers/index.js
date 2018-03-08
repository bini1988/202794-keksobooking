const express = require(`express`);
const multer = require(`multer`);
const offers = require(`../../services/offers`);

const upload = multer({dest: `uploads/`});
const offerUpload = upload.fields([
  {name: `avatar`, maxCount: 1},
  {name: `preview`, maxCount: 1}
]);

const router = express.Router(); // eslint-disable-line new-cap

router.get(`/offers`, offers.get);
router.post(`/offers`, offerUpload, offers.post);
router.get(`/offers/:date`, offers.getByDate);

module.exports = router;
