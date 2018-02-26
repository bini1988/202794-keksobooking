/* eslint-disable max-nested-callbacks */

const request = require(`supertest`);
const express = require(`express`);
const assert = require(`assert`);
const {
  assertObjectProperty,
  assertArray,
  assertInRange
} = require(`./utils`);


describe(`Create Server`, function () {
  let app = null;

  before(function () {
    app = express();
  });

  describe(`GET api/offers`, function () {
    it(`respond with json with default parameters`, function () {

      function assertResponse(response) {
        const DEFAULT_ITEMS_LIMIT = 20;

        assertObjectProperty(response, `data`);
        assertArray(response.data, `object`);
        assertInRange(response.data.length, 0, DEFAULT_ITEMS_LIMIT);
      }

      return request(app)
          .get(`api/offers`)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(200)
          .then(assertResponse);
    });

    it(`respond with limited items`, function () {
      const ITEMS_LIMIT = 5;

      function assertResponse(response) {
        assertObjectProperty(response, `data`);
        assertArray(response.data, `object`);
        assertInRange(response.data.length, 0, ITEMS_LIMIT);
      }

      return request(app)
          .get(`api/offers`)
          .query({skip: 0, limit: ITEMS_LIMIT})
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(200)
          .then(assertResponse);
    });

    it(`respond with bad request`, function () {
      const INVALID_VALUE = `invalid value`;

      function assertResponse(response) {
        assertArray(response, `object`);

        [`skip`, `limit`].forEach((field) => {
          const fieldObj = response.find(({fieldName}) => fieldName === field);

          assert(!fieldObj, `expect error object with property "fieldName" equal to "${field}"`);
          assert(fieldObj.error === `Validation Error`, `expect error object with property "error" equal to "Validation Error"`);
          assert(fieldObj.errorMessage === `invalid value`, `expect error object with property "errorMessage" equal to "invalid value"`);
        });
      }

      return request(app)
          .get(`api/offers`)
          .query({skip: INVALID_VALUE, limit: INVALID_VALUE})
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then(assertResponse);
    });
  });

  describe(`GET api/offers/:date`, function () {

  });
});

/* eslint-enable */
