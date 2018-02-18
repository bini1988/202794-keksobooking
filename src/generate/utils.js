
/**
 * Возвращает случайное целое число из заданного диапазона
 * @param  {number} min минимальное значение (включительно)
 * @param  {number} max максимальное значение (включительно)
 * @return {number}     случайное число
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Возвращает случайный элемент массива
 * @param  {Array} array массив элементов
 * @return {Any}         случайный элемент массива
 */
function getRandomArrayElement(array) {
  const index = getRandomInt(0, array.length - 1);
  return array[index];
}

/**
 * Возвращает массив с расположенными в случайном порядке элементами
 * @param  {Array} array исходный массив данных
 * @return {Array}       копия исходного массива с расположенными в случайном порядке элементами
 */
function shuffleArray(array) {
  const arr = array.slice();

  for (let index = arr.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
  }

  return arr;
}


module.exports = {
  getRandomInt,
  getRandomArrayElement,
  shuffleArray,
};

