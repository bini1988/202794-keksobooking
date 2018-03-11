const {Duplex} = require(`stream`);

/**
 * Имеет ли переданное значение беззнаковый целый тип
 * @param  {Any} value Проверяемое значение
 * @return {Boolean} Результат
 */
function isUnsignedInteger(value) {
  const number = parseInt(value, 10);
  return (Number.isInteger(number) && number >= 0);
}

function asyncMiddleware(fn) {
  return (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
  };
}

function toStream(buffer) {
  const stream = new Duplex();

  stream.push(buffer);
  stream.push(null);

  return stream;
}

module.exports = {
  isUnsignedInteger,
  asyncMiddleware,
  toStream,
};
