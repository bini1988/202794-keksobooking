const readline = require(`readline`);

const ASK_TO_GENERATE = `ASK_TO_GENERATE`;
const ASK_NUMBER_OF_ELEMENTS = `ASK_NUMBER_OF_ELEMENTS`;
const ASK_FILE_PATH = `ASK_FILE_PATH`;
const ASK_FILE_REWRITE = `ASK_FILE_REWRITE`;
const SAY_SAVED = `SAY_SAVED`;
const QUIT = `QUIT`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const doAction = {
  confirmGenerate(answer) {
    if (answer.match(/^д(а)?$/i)) {
      return {action: ASK_NUMBER_OF_ELEMENTS};
    }
    if (answer.match(/^н(ет)?$/i)) {
      return {action: QUIT};
    }
    return {action: ASK_TO_GENERATE};
  },
  readNumberOfElements(input) {
    const count = parseInt(input, 10);

    if (Number.isInteger(count)) {
      return {action: ASK_FILE_PATH, count};
    }
    return {action: ASK_NUMBER_OF_ELEMENTS};
  },
  confirmFilePath: () => {
    console.log();

    return {action: ASK_FILE_PATH};
  },
  [ASK_FILE_REWRITE]: () => {

  },
};

function ask(question) {
  return new Promise((resolve) => {
    rl.question(`${question} `, resolve);
  });
}

function say(message) {
  return Promise.resolve(message).then(console.log);
}

function mergeWith(state) {
  return (newState) => Object.assign({}, state, newState);
}

function* dialog() {
  let state = {
    action: ASK_TO_GENERATE
  };

  while (state.action !== QUIT) {
    switch (state.action) {
      case ASK_TO_GENERATE:
        state = yield ask(`Сгенерировать тестовые данные? (Да/Нет)`)
            .then(doAction.confirmGenerate)
            .then(mergeWith(state));
        break;
      case ASK_NUMBER_OF_ELEMENTS:
        state = yield ask(`Cколько элементов в соответствии с проектом нужно создать?`)
            .then(doAction.readNumberOfElements)
            .then(mergeWith(state));
        break;
      case ASK_FILE_PATH:
        state = yield ask(`Укажите путь до файла в котором необходимо сохранить данные?`)
            .then(doAction.confirmFilePath)
            .then(mergeWith(state));
        break;
      case ASK_FILE_REWRITE:
        state = yield ask(`Такой файл уже существует, нужно ли его перезаписать?`)
            .then(doAction.ASK_FILE_REWRITE)
            .then(mergeWith(state));
        break;
      case SAY_SAVED:
        say(`Данные успешно записаны в файл!`);
        break;
    }
  }

  rl.close();
}

function go(generator) {

  function runTo(state) {
    if (!state.done) {
      return state.value
          .then((result) => runTo(generator.next(result)))
          .catch(console.log);
    }
    return state.value;
  }

  return runTo(generator.next());
}

module.exports = {
  showGenerateDialog() {
    go(dialog());
  }
};

// Если пользователь запустил программу без параметров, то программа должна поприветствовать пользователя и предложить сгенерировать данные

// Программа должна спросить сколько элементов в соответствии с проектом нужно создать

// Попросить указать путь до файла в котором сохранить данные

// Если такой файл уже существует, то спросить нужно ли его перезаписать

// Дополнительно: покрыть код создания и перезаписи файлов тестами
