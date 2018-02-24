const fs = require(`fs`);
const path = require(`path`);
const http = require(`http`);
const util = require(`util`);
const url = require(`url`);

const fread = util.promisify(fs.readFile);

const STATIC_FOLDER = `${process.cwd()}/static`;
const HOST_NAME = `127.0.0.1`;
const PORT = 3000;

function getContentType(type) {
  const contentTypes = {
    'css': `text/css`,
    'html': `text/html; charset=UTF-8`,
    'jpg': `image/jpeg`,
    'ico': `image/x-icon`,
    'gif': `image/gif`,
    'png': `image/png`,
    'svg': `image/svg+xml`
  };

  return contentTypes[type] || `application/octet-stream`;
}

const server = http.createServer(async (req, res) => {
  const reqURL = url.parse(req.url);

  const filePath = (reqURL.pathname === `/`)
    ? `${STATIC_FOLDER}/index.html`
    : `${STATIC_FOLDER}${reqURL.pathname}`;

  try {
    const fileContent = await fread(filePath);
    const fileExt = path.extname(filePath).slice(1);
    const contentType = getContentType(fileExt);
    const contentLen = Buffer.byteLength(fileContent);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': contentLen,
    });
    res.end(fileContent);

    console.log(`[i] ${req.method} ${reqURL.pathname}`);

  } catch (err) {
    if (err.code === `ENOENT` || err.code === `EISDIR`) {
      res.writeHead(404, {'Content-Type': `text/plain`});
    } else {
      res.writeHead(500, {'Content-Type': `text/plain`});
    }
    console.log(err.message);
    res.end();
  }
});

module.exports = {
  run(args) {
    const [port = PORT] = args;

    server.listen(port, HOST_NAME, () => {
      console.log(`[i] Server was successfully started at ${HOST_NAME}:${port}`);
    });
  }
};
