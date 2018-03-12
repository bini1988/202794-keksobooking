require(`dotenv`).config();
const APP_VERSION = require(`./package.json`).version;
const APP_AUTHOR = require(`./package.json`).author;
const commands = require(`./src/commands`);

if (process.argv.length < 3) {
  console.log(`Keksobooking App v${APP_VERSION}`);
  console.log(`Author: ${APP_AUTHOR}`);
  console.log(`For more info please run app with --help command`);
} else {
  commands.execute(process.argv.slice(2));
}
