const APP_AUTHOR = require(`../../package.json`).author;

module.exports = {
  name: `author`,
  description: `вывод автора приложения`,
  execute() {
    console.log(`Author: ${APP_AUTHOR}`);
  }
};
