
const cmds = [];

cmds.push(
    require(`./help`)(cmds),
    require(`./server`),
    require(`./author`),
    require(`./description`),
    require(`./license`),
    require(`./version`),
    require(`./fill`),
);

function printCommandUnknown(cmd) {
  console.error(`Неизвестная команда "${cmd}".`);
  console.error(`Чтобы прочитать правила использования приложения, наберите "--help"`);
  process.exit(1);
}

function isCmd(arg) {
  return arg.match(/^--[\w\d]+$/i);
}

function parseCmds(arr) {
  const cmdsArr = [];
  let cmd = {args: []};

  for (const arg of arr) {
    if (isCmd(arg)) {
      cmd = {type: arg, args: []};
      cmdsArr.push(cmd);
    } else {
      cmd.args.push(arg);
    }
  }

  return cmdsArr;
}

function execute(args) {
  const cmdsArr = parseCmds(args);

  for (const cmd of cmdsArr) {
    const cmdObj = cmds.find((item) => {
      return `--${item.name}` === cmd.type;
    });

    if (cmdObj) {
      cmdObj.execute(cmd.args);
    } else {
      printCommandUnknown(cmd.type);
    }
  }
}

module.exports = {
  execute,
};
