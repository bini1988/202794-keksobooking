const APP_VERSION = require(`./package.json`).version;
const APP_AUTHOR = require(`./package.json`).author;
const executeCommands = require(`./src/execute-commands`);

function printGreeting() {
  console.log(`Keksobooking App v${APP_VERSION}`);
  console.log(`Author: ${APP_AUTHOR}`);
  console.log(`🤘 Coming soon...`);
}

if (process.argv.length < 3) {
  printGreeting();
} else {
  executeCommands(process.argv.slice(2));
}
