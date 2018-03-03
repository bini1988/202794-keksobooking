const APP_LICENSE = require(`../../package.json`).license;

module.exports = {
  name: `license`,
  args: [],
  description: `вывод лицензии приложения`,
  execute() {
    console.log(`License: ${APP_LICENSE}`);
  }
};
