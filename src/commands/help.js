require(`colors`);

module.exports = (commands = []) => ({
  name: `help`,
  description: `печатает этот текст`,
  execute() {
    const NAME_FIELD_WIDTH = 15;

    console.log(`Доступные команды:`);

    for (const {name, description} of commands) {
      const fieldName = `${name.padEnd(NAME_FIELD_WIDTH)}`.grey;
      const fieldDescription = `${description}`.green;

      console.log(`${fieldName} - ${fieldDescription};`);
    }
  }
});
