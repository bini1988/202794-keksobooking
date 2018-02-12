const APP_VERSION = require(`../../package.json`).version;

module.exports = {
  name: `version`,
  description: `печатает версию приложения`,
  execute() {
    console.log(`v${APP_VERSION}`);
  }
};
