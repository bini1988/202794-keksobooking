const readline = require(`readline`);
const util = require(`util`);
const fs = require(`fs`);

const fopen = util.promisify(fs.open);
const fclose = util.promisify(fs.close);

const ASK_TO_GENERATE = `ASK_TO_GENERATE`;
const ASK_NUMBER_OF_ELEMENTS = `ASK_NUMBER_OF_ELEMENTS`;
const ASK_FILE_PATH = `ASK_FILE_PATH`;
const ASK_FILE_REWRITE = `ASK_FILE_REWRITE`;
const SAVE_DATA = `SAVE_DATA`;
const QUIT = `QUIT`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function confirmGenerate(answer) {
  if (answer.match(/^д(а)?$/i)) {
    return {action: ASK_NUMBER_OF_ELEMENTS};
  }
  if (answer.match(/^н(ет)?$/i)) {
    return {action: QUIT};
  }
  return {action: ASK_TO_GENERATE};
}

function readNumberOfElements(input) {
  const count = parseInt(input, 10);

  if (Number.isInteger(count) && count > 0) {
    return {action: ASK_FILE_PATH, count};
  } else {
    console.log(`Пожалуйста введите целое число больше 0!`);
    return {action: ASK_NUMBER_OF_ELEMENTS};
  }
}

async function checkoutFilePath(path) {
  let fd = null;

  try {
    fd = await fopen(path, `wx`);

    return {action: SAVE_DATA, fd};

  } catch (err) {

    fclose(fd);

    if (err.code === `EEXIST`) {
      return {action: ASK_FILE_REWRITE};
    }
    console.log(`Ошибка записи данных в файл: ${err}`);
  }

  return {action: ASK_FILE_PATH};
}


function confirmRewrite(answer) {
  if (answer.match(/^д(а)?$/i)) {
    return {action: SAVE_DATA};
  }
  if (answer.match(/^н(ет)?$/i)) {
    return {action: ASK_FILE_PATH};
  }
  return {action: ASK_FILE_REWRITE};
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(`${question} `, resolve);
  });
}

// function say(message) {
//   return Promise.resolve(message).then(console.log);
// }

function mergeWith(state) {
  return (newState) => Object.assign({}, state, newState);
}

async function dialog() {
  let state = {
    action: ASK_TO_GENERATE
  };

  while (state.action !== QUIT) {
    switch (state.action) {
      case ASK_TO_GENERATE:
        state = await ask(`Сгенерировать тестовые данные? (Да/Нет) :`)
            .then(confirmGenerate)
            .then(mergeWith(state));
        break;
      case ASK_NUMBER_OF_ELEMENTS:
        state = await ask(`Cколько элементов в соответствии с проектом нужно создать? (от 1 и более) :`)
            .then(readNumberOfElements)
            .then(mergeWith(state));
        break;
      case ASK_FILE_PATH:
        state = await ask(`Укажите путь до файла в котором необходимо сохранить данные? :`)
            .then(checkoutFilePath)
            .then(mergeWith(state));
        break;
      case ASK_FILE_REWRITE:
        state = await ask(`Такой файл уже существует, нужно ли его перезаписать? (Да/Нет) :`)
            .then(confirmRewrite)
            .then(mergeWith(state));
        break;
      case SAVE_DATA:
        // say(`Данные успешно записаны в файл!`);
        break;
    }
  }

  rl.close();
}

module.exports = {
  async showGenerateDialog() {
    await dialog();
  }
};

// Если пользователь запустил программу без параметров, то программа должна поприветствовать пользователя и предложить сгенерировать данные

// Программа должна спросить сколько элементов в соответствии с проектом нужно создать

// Попросить указать путь до файла в котором сохранить данные

// Если такой файл уже существует, то спросить нужно ли его перезаписать

// Дополнительно: покрыть код создания и перезаписи файлов тестами
