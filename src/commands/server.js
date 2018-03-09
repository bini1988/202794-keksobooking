const {run} = require(`../server`);

module.exports = {
  name: `server`,
  args: [{name: `PORT`}],
  description: `запускает сервер на выбранном порту`,
  execute(args) {
    run(args);
  }
};
