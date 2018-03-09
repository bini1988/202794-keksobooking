const logging = require(`./logging`);
const api = require(`./api`);
const error404Controller = require(`../controllers/error-404`);
const errorController = require(`../controllers/error`);

module.exports = (app) => {
  app.use(logging);
  app.use(api);
  app.use(error404Controller.index);
  app.use(errorController.index);
};
