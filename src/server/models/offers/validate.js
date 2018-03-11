const {getRandomArrayElement} = require(`../../../utils/array`);
const {hasType, hasLength, hasMaxLength, oneOf, inRange, hasTimeFormat, isSet, subsetOf, hasMimeType} = require(`../../../utils/validation`);
const {ValidationError} = require(`../../services/errors`);


const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 140;
const DESCRIPTION_MIN_LENGTH = 0;
const DESCRIPTION_MAX_LENGTH = 140;
const MIN_PRICE = 1;
const MAX_PRICE = 100000;
const ADDRESS_MAX_LENGTH = 140;
const MIN_ROOMS = 0;
const MAX_ROOMS = 1000;
const MIN_GUESTS = 0;
const MAX_GUESTS = 1000;
const DEFAULT_NAMES = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];


const OFFER_FIELDS = [{
  name: `title`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  validations: [
    hasType(`string`),
    hasLength(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH),
  ],
}, {
  name: `description`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  validations: [
    hasType(`string`),
    hasLength(DESCRIPTION_MIN_LENGTH, DESCRIPTION_MAX_LENGTH),
  ],
}, {
  name: `type`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim().toLowerCase();
  },
  validations: [
    hasType(`string`),
    oneOf([`flat`, `house`, `bungalo`, `palace`]),
  ],
}, {
  name: `price`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return parseInt(value, 10);
  },
  validations: [
    hasType(`number`),
    inRange(MIN_PRICE, MAX_PRICE),
  ],
}, {
  name: `address`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  validations: [
    hasType(`string`),
    hasMaxLength(ADDRESS_MAX_LENGTH),
  ],
}, {
  name: `timein`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  validations: [
    hasType(`string`),
    hasTimeFormat(),
  ],
}, {
  name: `timeout`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  validations: [
    hasType(`string`),
    hasTimeFormat(),
  ],
}, {
  name: `rooms`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return parseInt(value, 10);
  },
  validations: [
    hasType(`number`),
    inRange(MIN_ROOMS, MAX_ROOMS),
  ],
}, {
  name: `guests`,
  required: false,
  errorMessage: `incorrect value`,
  normalize(value) {
    return parseInt(value, 10);
  },
  validations: [
    hasType(`number`),
    inRange(MIN_GUESTS, MAX_GUESTS),
  ],
}, {
  name: `features`,
  required: false,
  errorMessage: `incorrect value`,
  normalize(value) {
    return value && value.map((item) => {
      return `${item}`.trim().toLowerCase();
    });
  },
  validations: [
    hasType(`array`),
    isSet,
    subsetOf([
      `dishwasher`,
      `elevator`,
      `conditioner`,
      `parking`,
      `washer`,
      `wifi`
    ]),
  ],
}, {
  name: `avatar`,
  required: false,
  errorMessage: `incorrect attachment type`,
  normalize(value) {
    return value;
  },
  validations: [
    hasMimeType([
      `image/gif`,
      `image/jpeg`,
      `image/png`
    ]),
  ],
}, {
  name: `preview`,
  required: false,
  errorMessage: `incorrect attachment type`,
  normalize(value) {
    return value;
  },
  validations: [
    hasMimeType([
      `image/gif`,
      `image/jpeg`,
      `image/png`
    ]),
  ],
}, {
  name: `name`,
  required: false,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  validations: [
    hasType(`string`),
  ],
  get default() {
    return getRandomArrayElement(DEFAULT_NAMES);
  },
}];

function isValid(validations, value) {
  return validations
      .map((validate) => validate(value))
      .every((item) => item === true);
}

module.exports = {
  validate(obj) {
    const error = new ValidationError();
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const out = {};

    for (const field of OFFER_FIELDS) {
      const {name, required, normalize, validations} = field;
      const value = normalize(obj[name]);
      const valid = isValid(validations, value);
      const contains = hasOwnProperty.call(obj, name);

      if (!contains && required) {
        error.add(name, `is required`);
      }

      if (!contains && !required && field.default) {
        out[name] = field.default;
      }

      if (contains && valid) {
        out[name] = value;
      }

      if (contains && !valid) {
        error.add(name, field.errorMessage);
      }
    }

    if (error.hasErrors) {
      throw error;
    }

    return out;
  }
};
