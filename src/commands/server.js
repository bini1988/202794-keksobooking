const server = require(`../server/create-server`);

module.exports = {
  name: `server`,
  description: `запуск сервера на указанном порту`,
  execute(args) {
    server.run(args);
  }
};
