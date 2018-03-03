const locationFactory = require(`./location`);
const authorFactory = require(`./author`);
const offerFactory = require(`./offer`);

function generateEntity() {
  const author = authorFactory.entity;
  const location = locationFactory.entity;
  const offer = offerFactory.entity(location);

  return {author, offer, location};
}

function generateEntities(count = 0) {
  const entities = [];

  for (let index = 0; index < count; index++) {
    entities.push(generateEntity());
  }

  return entities;
}

module.exports = {
  generateEntity,
  generateEntities,
};
