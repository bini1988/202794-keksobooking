require(`colors`);

const APP_VERSION = require(`../../package.json`).version;

function colorizeVersion(version) {
  return version.split(`.`).map((it, index) => {
    switch (index) {
      case 0:
        return `${it}`.red;
      case 1:
        return `${it}`.green;
      case 2:
        return `${it}`.blue;
      default:
        return `${it}`;
    }
  }).join(`.`);
}

module.exports = {
  name: `version`,
  description: `печатает версию приложения`,
  execute() {
    console.log(`v${colorizeVersion(APP_VERSION)}`);
  }
};
