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

async function ask(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise((resolve) => {
    rl.question(`${message} `, resolve);
  });

  rl.close();

  return answer;
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

function merge(state, newState) {
  return Object.assign({}, state, newState);
}


function confirmGenerate(answer) {
  if (isYes(answer)) {
    return {action: ASK_NUMBER_OF_ELEMENTS};
  } else if (isNo(answer)) {
    return {action: QUIT};
  }
  return {action: ASK_TO_GENERATE};
}

function readNumber(input) {
  const count = parseInt(input, 10);

  if (isUInt(count)) {
    return {action: ASK_FILE_PATH, count};
  }
  return {action: ASK_NUMBER_OF_ELEMENTS};
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
    console.log(err.message);
  }
  return {action: ASK_FILE_PATH};
}


function confirmRewrite(answer) {
  if (isYes(answer)) {
    return {action: SAVE_DATA};
  } else if (isNo(answer)) {
    return {action: ASK_FILE_PATH};
  }
  return {action: ASK_FILE_REWRITE};
}

async function saveData({count, path, fd}) {
  try {

    fd = fd || await fopen(path, `w`);

    const entities = generateEntities(count);

    await fwrite(fd, JSON.stringify(entities, null, 2), 0, `utf-8`);

    console.log(`Данные были успешно записаны в файл '${path}'`);
  } catch (err) {
    console.log(`Не удалось сохранить данные в файл '${path}'`);
    console.log(err.message);
  } finally {
    await fclose(fd);
    return {action: QUIT};
  }
}

async function reduce(state) {
  switch (state.action) {
    case ASK_TO_GENERATE:
      const answer = await ask(`Сгенерировать тестовые данные? (Да/Нет) :`);
      return confirmGenerate(answer);
    case ASK_NUMBER_OF_ELEMENTS:
      const input = await ask(`Cколько элементов в соответствии с проектом нужно создать? (от 1 и более) :`);
      return readNumber(input);
    case ASK_FILE_PATH:
      const path = await ask(`Укажите путь до файла в котором необходимо сохранить данные? :`);
      return await openFile(path);
    case ASK_FILE_REWRITE:
      const confirm = await ask(`Такой файл уже существует, нужно ли его перезаписать? (Да/Нет) :`);
      return confirmRewrite(confirm);
    case SAVE_DATA:
      return await saveData(state);
    default:
      return state;
  }
}

async function dialog() {
  let state = {action: ASK_TO_GENERATE};

  while (state.action !== QUIT) {
    state = merge(state, await reduce(state));
  }
}

async function show() {
  try {
    await dialog();
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {
  show,
};
