const {generateEntities} = require(`../../../generate`);

const ENTITIES_COUNT = 30;

const entities = generateEntities(ENTITIES_COUNT);

module.exports = {
  get(skip = 0, limit = ENTITIES_COUNT) {
    return entities.slice(skip, skip + limit);
  },
  getByDate(date) {
    return entities.find((item) => item.date === date);
  },
  add(item) {
    const date = Date.now().valueOf();
    const entity = Object.assign({}, item, {date});

    entities.push(entity);

    return date;
  },
  count() {
    return ENTITIES_COUNT;
  }
};
