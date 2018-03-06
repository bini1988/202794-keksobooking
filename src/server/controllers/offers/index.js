const express = require(`express`);
const multer = require(`multer`);
const offers = require(`../../services/offers`);

const upload = multer({dest: `uploads/`});
const router = express.Router(); // eslint-disable-line new-cap

router.get(`/offers`, offers.get);
router.post(`/offers`, upload.single(`avatar`), offers.post);
router.get(`/offers/:date`, offers.getByDate);

module.exports = router;
