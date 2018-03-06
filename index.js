const APP_VERSION = require(`./package.json`).version;
const APP_AUTHOR = require(`./package.json`).author;
const commands = require(`./src/commands`);
const {dialog} = require(`./src/generate`);

if (process.argv.length < 3) {
  console.log(`Keksobooking App v${APP_VERSION}`);
  console.log(`Author: ${APP_AUTHOR}`);

  dialog.show();
} else {
  commands.execute(process.argv.slice(2));
}
