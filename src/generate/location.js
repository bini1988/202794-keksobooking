const {getRandomInt} = require(`../utils`);

const location = {
  options: {
    x: {
      min: 300,
      max: 900,
    },
    y: {
      min: 150,
      max: 500,
    },
  },
  get x() {
    const {min, max} = this.options.x;
    return getRandomInt(min, max);
  },
  get y() {
    const {min, max} = this.options.y;
    return getRandomInt(min, max);
  },
  get entity() {
    return {
      x: this.x,
      y: this.y,
    };
  },
};

module.exports = location;
