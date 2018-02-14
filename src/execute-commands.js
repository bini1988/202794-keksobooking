
const cmds = [];

cmds.push(
    require(`./commands/help`)(cmds),
    require(`./commands/author`),
    require(`./commands/description`),
    require(`./commands/license`),
    require(`./commands/version`)
);

function printCommandUnknown(cmd) {
  console.error(`Неизвестная команда "${cmd}".`);
  console.error(`Чтобы прочитать правила использования приложения, наберите "--help"`);
  process.exit(1);
}

function executeCommands(args) {
  for (const arg of args) {
    const cmd = cmds.find((it) => `--${it.name}` === arg);

    if (cmd) {
      cmd.execute();
    } else {
      printCommandUnknown(arg);
    }
  }
}

module.exports = executeCommands;
