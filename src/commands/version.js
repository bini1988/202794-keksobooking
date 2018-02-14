require(`colors`);

const APP_VERSION = require(`../../package.json`).version;

function colorizeVersion(version) {
  const colors = [`red`, `green`, `blue`];

  return version.split(`.`).map((item, index) => {
    return (colors[index] && `${item}`[colors[index]]) || `${item}`;
  }).join(`.`);
}

module.exports = {
  name: `version`,
  description: `печатает версию приложения`,
  execute() {
    console.log(`v${colorizeVersion(APP_VERSION)}`);
  }
};
