
class Bucket {
  constructor(fsBucket) {
    this._fsBucket = fsBucket;
  }

  async getInfo(filename) {
    const files = await this._fsBucket
        .find({filename})
        .toArray();

    return files[0];
  }

  async get(filename) {
    return this._fsBucket.openDownloadStreamByName(filename);
  }

  async put(filename, stream) {
    return new Promise((resolve, reject) => {
      stream.pipe(this._fsBucket.openUploadStream(filename))
          .on(`finish`, resolve)
          .on(`error`, reject);
    });
  }
}

module.exports = Bucket;
