const {asyncMiddleware, toStream} = require(`../../services/utils`);
const {getValidatedOffer} = require(`./validate-offer`);

function setAttachedFile(form, files, type) {
  if (files && files[type] && files[type][0]) {
    form[type] = files[type][0];
  }
}

async function saveAttachedFile(models, offerForm, fileType) {
  const path = `/api/offers/${offerForm.date}/${fileType}`;
  const mimetype = offerForm[fileType].mimetype;

  await models.offers.files.put(path, toStream(offerForm[fileType].buffer));

  return {path, mimetype};
}

module.exports = asyncMiddleware(async (req, res) => {
  const models = req.app.locals.models;
  const date = Date.now().valueOf();
  const offerForm = req.body;

  offerForm.date = date;
  setAttachedFile(offerForm, req.files, `avatar`);
  setAttachedFile(offerForm, req.files, `preview`);

  const offer = getValidatedOffer(offerForm);

  if (offerForm.avatar) {
    offer.avatar = await saveAttachedFile(models, offerForm, `avatar`);
  }

  if (offerForm.preview) {
    offer.preview = await saveAttachedFile(models, offerForm, `preview`);
  }

  await models.offers.insert(offer);

  res.status(200).json(offer);
});
