const {getRandomInt, getRandomArrayElement, shuffleArray} = require(`./utils`);

const offer = {
  _titles: [],
  options: {
    titles: [
      `Большая уютная квартира`,
      `Маленькая неуютная квартира`,
      `Огромный прекрасный дворец`,
      `Маленький ужасный дворец`,
      `Красивый гостевой домик`,
      `Некрасивый негостеприимный домик`,
      `Уютное бунгало далеко от моря`,
      `Неуютное бунгало по колено в воде`,
    ],
    price: {
      min: 1000,
      max: 1000000,
    },
    types: [`flat`, `palace`, `house`, `bungalo`],
    rooms: {
      min: 1,
      max: 5,
    },
    guests: {
      min: 0,
      max: 15,
    },
    checkin: [`12:00`, `13:00`, `14:00`],
    checkout: [`12:00`, `13:00`, `14:00`],
    features: [
      `wifi`,
      `dishwasher`,
      `parking`,
      `washer`,
      `elevator`,
      `conditioner`
    ],
    photos: [
      `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
      `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
      `http://o0.github.io/assets/images/tokyo/hotel3.jpg`,
    ],
  },
  get title() {
    if (this._titles.length === 0) {
      this._titles = shuffleArray(this.options.titles);
    }

    return this._titles.pop();
  },
  get price() {
    const {min, max} = this.options.price;
    return getRandomInt(min, max);
  },
  get type() {
    return getRandomArrayElement(this.options.types);
  },
  get rooms() {
    const {min, max} = this.options.rooms;
    return getRandomInt(min, max);
  },
  get guests() {
    const {min, max} = this.options.guests;
    return getRandomInt(min, max);
  },
  get checkin() {
    return getRandomArrayElement(this.options.checkin);
  },
  get checkout() {
    return getRandomArrayElement(this.options.checkout);
  },
  get features() {
    const arr = shuffleArray(this.options.features);
    return arr.slice(0, getRandomInt(1, arr.length - 1));
  },
  get description() {
    return ``;
  },
  get photos() {
    return shuffleArray(this.options.photos);
  },
  get entity() {
    return {
      title: this.title,
      price: this.price,
      type: this.type,
      rooms: this.rooms,
      guests: this.guests,
      checkin: this.checkin,
      checkout: this.checkout,
      features: this.features,
      description: this.description,
      photos: this.photos,
    };
  },
};

module.exports = offer;
