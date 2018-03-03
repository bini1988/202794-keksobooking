const server = require(`../server/server`);

module.exports = {
  name: `server`,
  args: [{name: `PORT`}],
  description: `запускает сервер на выбранном порту`,
  execute(args) {
    server.run(args);
  }
};
