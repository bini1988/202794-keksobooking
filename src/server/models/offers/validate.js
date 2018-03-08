const {getRandomArrayElement} = require(`../../../utils`);
const {ValidationError} = require(`../../services/errors`);

const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 140;
const DESCRIPTION_MIN_LENGTH = 0;
const DESCRIPTION_MAX_LENGTH = 140;
const OFFER_TYPE_ENUM = new Set([`flat`, `house`, `bungalo`, `palace`]);
const MIN_PRICE = 1;
const MAX_PRICE = 100000;
const ADDRESS_MAX_LENGTH = 140;
const TIME_STAMP_REGEXP = /^(([0-1]\d)|([2][0-3])):[0-5]\d$/i;
const MIN_ROOMS = 0;
const MAX_ROOMS = 1000;
const MIN_GUESTS = 0;
const MAX_GUESTS = 1000;
const OFFER_FEATURES_ENUM = new Set([`dishwasher`, `elevator`, `conditioner`, `parking`, `washer`, `wifi`]);
const DEFAULT_NAMES = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];
const IMG_MIMETYPES_ENUM = new Set([`image/gif`, `image/jpeg`, `image/png`]);

function isSet(value) {
  return (new Set(value)).size === value.length;
}

function isSubset(value, ofEnum) {
  return value.every((item) => ofEnum.has(item));
}

const OFFER_FIELDS = [{
  name: `title`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  isValid(value) {
    return (typeof value === `string`) &&
      (value.length >= TITLE_MIN_LENGTH) &&
      (value.length <= TITLE_MAX_LENGTH);
  },
}, {
  name: `description`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  isValid(value) {
    return (typeof value === `string`) &&
      (value.length >= DESCRIPTION_MIN_LENGTH) &&
      (value.length <= DESCRIPTION_MAX_LENGTH);
  },
}, {
  name: `type`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim().toLowerCase();
  },
  isValid(value) {
    return (typeof value === `string`) &&
      OFFER_TYPE_ENUM.has(value);
  },
}, {
  name: `price`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return parseInt(value, 10);
  },
  isValid(value) {
    return (typeof value === `number`) &&
      (value >= MIN_PRICE) &&
      (value <= MAX_PRICE);
  },
}, {
  name: `address`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  isValid(value) {
    return (typeof value === `string`) &&
      (value.length <= ADDRESS_MAX_LENGTH);
  },
}, {
  name: `timein`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  isValid(value) {
    return (typeof value === `string`) &&
      (TIME_STAMP_REGEXP.test(value));
  },
}, {
  name: `timeout`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  isValid(value) {
    return (typeof value === `string`) &&
      (TIME_STAMP_REGEXP.test(value));
  },
}, {
  name: `rooms`,
  required: true,
  errorMessage: `incorrect value`,
  normalize(value) {
    return parseInt(value, 10);
  },
  isValid(value) {
    return (typeof value === `number`) &&
      (value >= MIN_ROOMS) &&
      (value <= MAX_ROOMS);
  },
}, {
  name: `guests`,
  required: false,
  errorMessage: `incorrect value`,
  normalize(value) {
    return parseInt(value, 10);
  },
  isValid(value) {
    return (typeof value === `number`) &&
      (value >= MIN_GUESTS) &&
      (value <= MAX_GUESTS);
  },
}, {
  name: `features`,
  required: false,
  errorMessage: `incorrect value`,
  normalize(value) {
    return value && value.map((item) => {
      return `${item}`.trim().toLowerCase();
    });
  },
  isValid(value) {
    return Array.isArray(value) &&
      isSubset(value, OFFER_FEATURES_ENUM) &&
      isSet(value);
  },
}, {
  name: `avatar`,
  required: false,
  errorMessage: `incorrect attachment type`,
  normalize(value) {
    return value;
  },
  isValid(value) {
    return value && IMG_MIMETYPES_ENUM.has(value.mimetype);
  },
}, {
  name: `preview`,
  required: false,
  errorMessage: `incorrect attachment type`,
  normalize(value) {
    return value;
  },
  isValid(value) {
    return value && IMG_MIMETYPES_ENUM.has(value.mimetype);
  },
}, {
  name: `name`,
  required: false,
  errorMessage: `incorrect value`,
  normalize(value) {
    return `${value}`.trim();
  },
  get default() {
    return getRandomArrayElement(DEFAULT_NAMES);
  },
  isValid(value) {
    return (typeof value === `string`);
  },
}];

module.exports = {
  validate(obj) {
    const error = new ValidationError();
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const out = {};

    for (const field of OFFER_FIELDS) {
      const {name, required, normalize, isValid} = field;
      const value = normalize(obj[name]);
      const valid = isValid(value);
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
