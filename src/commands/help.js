require(`colors`);

const NAME_FIELD_WIDTH = 20;

module.exports = (commands = []) => ({
  name: `help`,
  args: [],
  description: `выводит список доступных команд`,
  execute() {

    console.log(`Доступные команды:`);

    for (const {name, args, description} of commands) {
      const fieldArgs = args.map((arg) => `[${arg.name}]`).join(` `);
      const fieldName = `${name} ${fieldArgs}`.padEnd(NAME_FIELD_WIDTH).grey;
      const fieldDescription = `${description}`.green;

      console.log(`${fieldName} - ${fieldDescription};`);
    }
  }
});
