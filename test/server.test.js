/* eslint-disable max-nested-callbacks */

const request = require(`supertest`);
const app = require(`../src/server/server`);
const assert = require(`assert`);
const {
  assertObjectProperty,
  assertArray,
  assertInRange,
  assertType
} = require(`./assert-utils`);


describe(`Create Server`, function () {

  describe(`GET api/offers`, function () {
    it(`respond with json with default parameters`, function () {

      function assertResponse(response) {
        const DEFAULT_ITEMS_LIMIT = 20;
        const DEFAULT_SKIP = 0;

        assertObjectProperty(response, `data`);
        assertArray(response.data, `object`);
        assertInRange(response.data.length, 0, DEFAULT_ITEMS_LIMIT);

        assertObjectProperty(response, `skip`);
        assert(response.skip === DEFAULT_SKIP, `"skip" should be equal ${DEFAULT_SKIP} by default`);
        assertObjectProperty(response, `limit`);
        assert(response.limit === DEFAULT_ITEMS_LIMIT, `"limit" should be equal ${DEFAULT_ITEMS_LIMIT} by default`);
        assertObjectProperty(response, `total`);
      }

      return request(app)
          .get(`api/offers`)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(200)
          .then(assertResponse);
    });

    it(`respond with limited items`, function () {
      const ITEMS_LIMIT = 3;
      const ITEMS_SKIP = 5;

      function assertResponse(response) {
        assertObjectProperty(response, `data`);
        assertArray(response.data, `object`);
        assertInRange(response.data.length, 0, ITEMS_LIMIT);

        for (const item of response.data) {
          assertObjectProperty(item, `author`, `offer`, `location`, `date`);
        }

        assertObjectProperty(response, `skip`);
        assert(response.skip === ITEMS_SKIP, `"skip" should be equal ${ITEMS_SKIP}`);
        assertObjectProperty(response, `limit`);
        assert(response.limit === ITEMS_LIMIT, `"limit" should be equal ${ITEMS_LIMIT}`);
        assertObjectProperty(response, `total`);
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
      function assertResponse(response) {
        const ERROR = `Validation Error`;
        const ERROR_MESSAGE = `invalid value`;

        assertArray(response, `object`);

        [`skip`, `limit`].forEach((item) => {
          const obj = response.find(({fieldName}) => fieldName === item);

          assert(obj, `expect error object with property "fieldName" equal to "${item}"`);
          assert(obj.error === ERROR, `expect error object with property "error" equal to "${ERROR}"`);
          assert(obj.errorMessage === ERROR_MESSAGE, `expect error object with property "errorMessage" equal to "${ERROR_MESSAGE}"`);
        });
      }

      return request(app)
          .get(`api/offers`)
          .query({skip: -1, limit: 0})
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
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
            .get(`api/offers/${date}`)
            .set(`Accept`, `application/json`)
            .expect(`Content-Type`, /json/)
            .expect(200)
            .then((offer) => {
              assertType(offer, `object`);
              assertObjectProperty(offer, `author`, `offer`, `location`, `date`);
              assert(offer.date === date, `expect offer object with requested date`);
            });
      }

      return request(app)
          .get(`api/offers`)
          .query({skip: 0, limit: ITEMS_LIMIT})
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(200)
          .then(assertResponse);
    });

    it(`respond with not found`, function () {
      const ERROR = `Not Found`;
      const ERROR_MESSAGE = `Offer with given date was not found`;
      const date = (new Date(1970, 0, 1)).getUTCMilliseconds();

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
          .get(`api/offers/${date}`)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(404)
          .then(assertResponse);
    });

    it(`respond with bad request`, function () {
      const ERROR = `Bad Request`;
      const ERROR_MESSAGE = `Unexpected request parameter type`;
      const date = `INVALID_DATE`;

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
          .get(`api/offers/${date}`)
          .set(`Accept`, `application/json`)
          .expect(`Content-Type`, /json/)
          .expect(400)
          .then(assertResponse);
    });
  });
});

/* eslint-enable */
