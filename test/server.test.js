/* eslint-disable max-nested-callbacks */

const request = require(`supertest`);
const {app} = require(`../src/server`);
const assert = require(`assert`);
const {
  assertObjectProperty,
  assertArray,
  assertInRange,
  assertType
} = require(`./assert-utils`);


describe(`Server`, function () {

  describe(`GET api`, function () {
    it(`resourse not found`, function () {
      const ERROR = `Not Found`;
      const ERROR_MESSAGE = `Resourse not found`;

      function assertResponse(response) {
        assertArray(response, `object`);
        assert(response.length > 0, `expect at least one item in array`);

        response.forEach((item) => {
          assertObjectProperty(item, `error`, `errorMessage`);
          assert(item.error === ERROR, `expect object with property "error" equal to "${ERROR}"`);
          assert(item.errorMessage === ERROR_MESSAGE, `expect object with property "errorMessage" equal to "${ERROR_MESSAGE}"`);
        });
      }

      return request(app)
          .get(`/api/unknown`)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(404)
          .then((response) => response.body)
          .then(assertResponse);
    });
  });

  describe(`GET api/offers`, function () {
    it(`respond with json with default parameters`, function () {

      function assertResponse(response) {
        const DEFAULT_ITEMS_SKIP = 0;
        const DEFAULT_ITEMS_LIMIT = 20;

        assertObjectProperty(response, `data`);
        assertArray(response.data, `object`);
        assertInRange(response.data.length, 0, DEFAULT_ITEMS_LIMIT);

        assertObjectProperty(response, `skip`);
        assert(response.skip === DEFAULT_ITEMS_SKIP, `"skip" should be equal ${DEFAULT_ITEMS_SKIP} by default`);
        assertObjectProperty(response, `limit`);
        assert(response.limit === DEFAULT_ITEMS_LIMIT, `"limit" should be equal ${DEFAULT_ITEMS_LIMIT} by default`);
        assertObjectProperty(response, `total`);
      }

      return request(app)
          .get(`/api/offers`)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(200)
          .then((response) => response.body)
          .then(assertResponse);
    });

    it(`respond with limited items`, function () {
      const ITEMS_LIMIT = 3;
      const ITEMS_SKIP = 5;

      function assertResponse(response) {
        assertObjectProperty(response, `data`);
        assertArray(response.data, `object`);
        assert(response.data.length === ITEMS_LIMIT, `expect array with length of ${ITEMS_LIMIT}`);

        for (const item of response.data) {
          assertObjectProperty(item, `author`, `offer`, `location`, `date`);
        }

        assertObjectProperty(response, `skip`, `limit`, `total`);
        assert(response.skip === ITEMS_SKIP, `"skip" should be equal ${ITEMS_SKIP}`);
        assert(response.limit === ITEMS_LIMIT, `"limit" should be equal ${ITEMS_LIMIT}`);
      }

      return request(app)
          .get(`/api/offers`)
          .query({skip: ITEMS_SKIP, limit: ITEMS_LIMIT})
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(200)
          .then((response) => response.body)
          .then(assertResponse);
    });

    it(`respond with bad request`, function () {
      function assertResponse(response) {
        const ERROR = `Validation Error`;
        const ERROR_MESSAGE = `Expect positive integer`;

        assertArray(response, `object`);

        [`skip`, `limit`].forEach((item) => {
          const obj = response.find(({fieldName}) => fieldName === item);

          assert(obj, `expect error object with property "fieldName" equal to "${item}"`);
          assert(obj.error === ERROR, `expect error object with property "error" equal to "${ERROR}"`);
          assert(obj.errorMessage === ERROR_MESSAGE, `expect error object with property "errorMessage" equal to "${ERROR_MESSAGE}"`);
        });
      }

      return request(app)
          .get(`/api/offers`)
          .query({skip: -1, limit: -1})
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then((response) => response.body)
          .then(assertResponse);
    });
  });

  describe(`GET api/offers/:date`, function () {
    it(`respond with json`, function () {
      const ITEMS_LIMIT = 1;

      function assertResponse(response) {
        assertObjectProperty(response, `data`);
        assertArray(response.data, `object`);
        assertInRange(response.data.length, 0, ITEMS_LIMIT);

        assertObjectProperty(response.data[0], `date`);

        const date = response.data[0].date;

        return request(app)
            .get(`/api/offers/${date}`)
            .set(`Accept`, `application/json`)
            .expect(`Content-Type`, /json/)
            .expect(200)
            .then((res) => res.body)
            .then((offer) => {
              assertType(offer, `object`);
              assertObjectProperty(offer, `author`, `offer`, `location`, `date`);
              assert(offer.date === date, `expect offer object with requested "date" field`);
            });
      }

      return request(app)
          .get(`/api/offers`)
          .query({skip: 0, limit: ITEMS_LIMIT})
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(200)
          .then((response) => response.body)
          .then(assertResponse);
    });

    it(`respond with not found`, function () {
      const date = (new Date(1970, 0, 1)).valueOf();
      const ERROR = `Not Found`;
      const ERROR_MESSAGE = `Offer with date '${date}' is not found`;

      function assertResponse(response) {
        assertArray(response, `object`);
        assert(response.length > 0, `expect at least one item in array`);

        response.forEach((item) => {
          assertObjectProperty(item, `error`, `errorMessage`);
          assert(item.error === ERROR, `expect object with property "error" equal to "${ERROR}"`);
          assert(item.errorMessage === ERROR_MESSAGE, `expect object with property "errorMessage" equal to "${ERROR_MESSAGE}"`);
        });
      }

      return request(app)
          .get(`/api/offers/${date}`)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(404)
          .then((response) => response.body)
          .then(assertResponse);
    });
  });

  describe(`POST api/offers`, function () {
    it(`respond with json`, function () {
      const data = {
        "name": `Pavel`,
        "title": `Маленькая квартирка рядом с парком`,
        "address": `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`,
        "description": `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`,
        "price": 30000,
        "type": `flat`,
        "rooms": 1,
        "guests": 1,
        "checkin": `9:00`,
        "checkout": `7:00`,
        "features": [`elevator`, `conditioner`]
      };

      function assertResponse(response) {
        assert.deepEqual(response, data, `expect given data object`);
      }

      const req = request(app)
          .post(`/api/offers`)
          .set(`Accept`, `application/json`);

      for (const prop in data) {
        if (data.hasOwnProperty(prop)) {
          req.field(prop, data[prop]);
        }
      }

      return req.attach(`avatar`, `test/avatar.png`)
          .expect(`Content-Type`, /json/)
          .expect(200)
          .then((response) => response.body)
          .then(assertResponse);
    });
  });
});

/* eslint-enable */
