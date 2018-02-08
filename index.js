const APP_VERSION = '0.0.1';
const APP_AUTHOR = 'Nikolai Karastelev';
const COMMANDS = {
  ['--version'] : {
    about: 'печатает версию приложения',
    execute: printVesion,
  },
  ['--help'] : {
    about: 'печатает этот текст',
    execute: printHelp,
  },
};


function printVesion() {
  console.log(`v${APP_VERSION}`);
}

function printHelp() {
  const ARG_FIELD_LENGTH = 10;

  console.log('Доступные команды:');

  for (const cmd in COMMANDS) {
    console.log(`${cmd.padEnd(ARG_FIELD_LENGTH)} - ${COMMANDS[cmd].about};`);
  }
}

function printCommandUnknown(cmd) {
  console.error(`Неизвестная команда ${cmd}.`);
  console.error('Чтобы прочитать правила использования приложения, наберите "--help"');
  process.exit(1);
}

function printGreeting() {
  console.log(`Keksobooking App v${APP_VERSION}`);
  console.log(`Author: ${APP_AUTHOR}`);
  console.log('🤘 Coming soon...');
}

function executeCommands(cmds) {
  for (const cmd of cmds) {
    if (COMMANDS[cmd]) {
      COMMANDS[cmd].execute();
    } else {
      printCommandUnknown(cmd);
    }
  }
}


if (process.argv.length < 3) {
  printGreeting();
} else {
  executeCommands(process.argv.slice(2));
}
