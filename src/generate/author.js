const crypto = require(`crypto`);

const author = {
  get avatar() {
    return `https://robohash.org/${crypto.randomBytes(10).toString(`hex`)}`;
  },
  get entity() {
    return {
      avatar: this.avatar,
    };
  },
};

module.exports = author;
