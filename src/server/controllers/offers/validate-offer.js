const {getRandomArrayElement} = require(`../../../utils/array`);
const {hasType, hasLength, hasMaxLength, oneOf, inRange, hasTimeFormat, isSet, subsetOf, hasMimeType} = require(`../../../utils/validation`);
const {ValidationError} = require(`../../services/errors`);

const Title = {
  MIN_LENGTH: 30,
  MAX_LENGTH: 140,
};

const Description = {
  MIN_LENGTH: 0,
  MAX_LENGTH: 140,
};

const Price = {
  MIN: 1,
  MAX: 100000,
};

const ADDRESS_MAX_LENGTH = 140;

const Rooms = {
  MIN: 0,
  MAX: 1000,
};

const Guests = {
  MIN: 0,
  MAX: 1000,
};

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
    hasLength(Title.MIN_LENGTH, Title.MAX_LENGTH),
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
    hasLength(Description.MIN_LENGTH, Description.MAX_LENGTH),
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
    inRange(Price.MIN, Price.MAX),
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
  name: `checkin`,
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
  name: `checkout`,
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
    inRange(Rooms.MIN, Rooms.MAX),
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
    inRange(Guests.MIN, Guests.MAX),
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
}, {
  name: `date`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return parseInt(value, 10);
  },
  validations: [
    hasType(`number`),
  ],
}];

const isValid = (validations, value) => {
  return validations
      .map((validate) => validate(value))
      .every((item) => item === true);
};

module.exports = {
  getValidatedOffer(obj) {
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
