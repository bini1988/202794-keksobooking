const multer = require(`multer`);
// const offers = require(`../models/offers`);

const upload = multer({dest: `uploads/`});

function postOffers(req, res) {
  // console.log(`POST Offer: `, req.body, req.file);

  const offer = req.body;
  // offers.add(offer);

  res.status(200).json(offer);
}

module.exports = [
  upload.single(`avatar`),
  postOffers
];
