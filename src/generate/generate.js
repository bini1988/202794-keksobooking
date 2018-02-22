const locationFactory = require(`./location`);
const authorFactory = require(`./author`);
const offerFactory = require(`./offer`);

function generateEntity() {
  const author = authorFactory.entity;
  const location = locationFactory.entity;
  const offer = offerFactory.entity(location);

  return {author, offer, location};
}

module.exports = {
  generateEntity,
};
