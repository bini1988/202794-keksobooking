
/**
 * Имеет ли переданное значение беззнаковый целый тип
 * @param  {Any} value Проверяемое значение
 * @return {Boolean} Результат
 */
function isUnsignedInteger(value) {
  const number = parseInt(value, 10);
  return (Number.isInteger(number) && number >= 0);
}

module.exports = {
  isUnsignedInteger,
};
