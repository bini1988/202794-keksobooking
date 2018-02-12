const APP_LICENSE = require(`../../package.json`).license;

module.exports = {
  name: `license`,
  description: `вывод лицензии приложения`,
  execute() {
    console.log(`License: ${APP_LICENSE}`);
  }
};
