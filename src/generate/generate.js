const {getRandomInt} = require(`../utils/array`);
const locationFactory = require(`./location`);
const authorFactory = require(`./author`);
const offerFactory = require(`./offer`);

const MIN_DATE = (new Date(2017, 0, 1)).valueOf();
const MAX_DATE = (new Date(2019, 0, 1)).valueOf();

function generateEntity() {
  const author = authorFactory.entity;
  const location = locationFactory.entity;
  const offer = offerFactory.entity(location);
  const date = getRandomInt(MIN_DATE, MAX_DATE);

  return {author, offer, location, date};
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
