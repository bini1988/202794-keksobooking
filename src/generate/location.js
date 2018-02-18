const {getRandomInt} = require(`./utils`);

const location = {
  _x: 0,
  _y: 0,
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
    this._x = getRandomInt(min, max);
    return this._x;
  },
  get y() {
    const {min, max} = this.options.y;
    this._y = getRandomInt(min, max);
    return this._y;
  },
  get address() {
    return `${this._x}, ${this._y}`;
  },
  get entity() {
    return {
      x: this.x,
      y: this.y,
    };
  },
};

module.exports = location;
