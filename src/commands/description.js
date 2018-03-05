const APP_DESCRIPTION = require(`../../package.json`).description;

module.exports = {
  name: `description`,
  args: [],
  description: `вывод описания приложения`,
  execute() {
    console.log(`About: ${APP_DESCRIPTION}`);
  }
};
