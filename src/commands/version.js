require(`colors`);

const APP_VERSION = require(`../../package.json`).version;

const colorizeVersion = (version) => {
  const colors = [`red`, `green`, `blue`];

  return version.split(`.`).map((item, index) => {
    return (colors[index] && `${item}`[colors[index]]) || `${item}`;
  }).join(`.`);
};

module.exports = {
  name: `version`,
  args: [],
  description: `выводит информацию о текущей версии приложения`,
  execute() {
    console.log(`v${colorizeVersion(APP_VERSION)}`);
  }
};
