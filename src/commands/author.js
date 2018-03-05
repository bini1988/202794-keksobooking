const APP_AUTHOR = require(`../../package.json`).author;

module.exports = {
  name: `author`,
  args: [],
  description: `выводит информацию об авторе приложения`,
  execute() {
    console.log(`Author: ${APP_AUTHOR}`);
  }
};
