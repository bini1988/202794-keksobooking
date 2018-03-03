const APP_VERSION = require(`./package.json`).version;
const APP_AUTHOR = require(`./package.json`).author;
const executeCommands = require(`./src/execute-commands`);
const {show: showGenerateDialog} = require(`./src/generate/dialog`);

if (process.argv.length < 3) {
  console.log(`Keksobooking App v${APP_VERSION}`);
  console.log(`Author: ${APP_AUTHOR}`);

  showGenerateDialog();
} else {
  executeCommands(process.argv.slice(2));
}
