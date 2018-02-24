const readline = require(`readline`);
const util = require(`util`);
const fs = require(`fs`);
const {generateEntities} = require(`./generate`);

const fopen = util.promisify(fs.open);
const fclose = util.promisify(fs.close);
const fwrite = util.promisify(fs.write);

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


function ask(question) {
  return new Promise((resolve) => {
    rl.question(`${question} `, resolve);
  });
}

function isYes(answer) {
  return answer.match(/^д(а)?$/i);
}

function isNo(answer) {
  return answer.match(/^н(ет)?$/i);
}

function isUInt(number) {
  return Number.isInteger(number) && (number > 0);
}

function take(state) {
  return Promise.resolve(state);
}

function merge(state) {
  return (newState) => Object.assign({}, state, newState);
}


function confirmGenerate(answer) {
  if (isYes(answer)) {
    return {action: ASK_NUMBER_OF_ELEMENTS};
  } else if (isNo(answer)) {
    return {action: QUIT};
  } else {
    return {action: ASK_TO_GENERATE};
  }
}

function readNumber(input) {
  const count = parseInt(input, 10);

  if (isUInt(count)) {
    return {action: ASK_FILE_PATH, count};
  } else {
    return {action: ASK_NUMBER_OF_ELEMENTS};
  }
}

async function openFile(path) {
  try {
    return {
      action: SAVE_DATA,
      fd: await fopen(path, `wx`),
      path
    };
  } catch (err) {
    if (err.code === `EEXIST`) {
      return {action: ASK_FILE_REWRITE, path};
    }
    console.log(`Не удалось открыть файл '${path}' на запись`);
    console.log(err);
  }

  return {action: ASK_FILE_PATH};
}


function confirmRewrite(answer) {
  if (isYes(answer)) {
    return {action: SAVE_DATA};
  } else if (isNo(answer)) {
    return {action: ASK_FILE_PATH};
  } else {
    return {action: ASK_FILE_REWRITE};
  }
}

async function saveData({count, path, fd}) {
  try {

    fd = fd || await fopen(path, `w`);

    const entities = generateEntities(count);

    await fwrite(fd, JSON.stringify(entities, null, 2), 0, `utf-8`);

    console.log(`Данные были успешно записаны в файл '${path}'`);
  } catch (err) {
    console.log(`Не удалось сохранить данные в файл '${path}'`);
    console.log(err);
  } finally {
    fclose(fd).catch(console.log);
    return {action: QUIT};
  }
}

async function dialog() {
  let state = {
    action: ASK_TO_GENERATE,
    count: 0,
    path: ``,
    fd: null
  };

  while (state.action !== QUIT) {
    switch (state.action) {
      case ASK_TO_GENERATE:
        state = await ask(`Сгенерировать тестовые данные? (Да/Нет) :`)
            .then(confirmGenerate)
            .then(merge(state));
        break;
      case ASK_NUMBER_OF_ELEMENTS:
        state = await ask(`Cколько элементов в соответствии с проектом нужно создать? (от 1 и более) :`)
            .then(readNumber)
            .then(merge(state));
        break;
      case ASK_FILE_PATH:
        state = await ask(`Укажите путь до файла в котором необходимо сохранить данные? :`)
            .then(await openFile)
            .then(merge(state));
        break;
      case ASK_FILE_REWRITE:
        state = await ask(`Такой файл уже существует, нужно ли его перезаписать? (Да/Нет) :`)
            .then(confirmRewrite)
            .then(merge(state));
        break;
      case SAVE_DATA:
        state = await take(state)
            .then(await saveData)
            .then(merge(state));
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
