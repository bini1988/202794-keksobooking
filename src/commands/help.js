module.exports = (commands = []) => ({
  name: `help`,
  description: `печатает этот текст`,
  execute() {
    const NAME_FIELD_WIDTH = 15;

    console.log(`Доступные команды:`);

    for (const {name, description} of commands) {
      console.log(`${name.padEnd(NAME_FIELD_WIDTH)} - ${description};`);
    }
  }
});
