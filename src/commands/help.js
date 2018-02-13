const commands = [
  require(`./author`),
  require(`./description`),
  require(`./license`),
  require(`./version`),
];

module.exports = {
  name: `help`,
  description: `печатает этот текст`,
  execute() {
    const NAME_FIELD_WIDTH = 15;

    console.log(`Доступные команды:`);
    console.log(`${this.name.padEnd(NAME_FIELD_WIDTH)} - ${this.description};`);

    for (const {name, description} of commands) {
      console.log(`${name.padEnd(NAME_FIELD_WIDTH)} - ${description};`);
    }
  }
};
