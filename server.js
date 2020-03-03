const fs = require('fs');
const http = require('http');
const { app } = require('./handlers');
const defaultPort = process.env.PORT || 4000;

const setUpDataBase = function() {
  const data = `${__dirname}/data`;
  if (!fs.existsSync(`${data}`)) {
    fs.mkdirSync(`${data}`);
  }
};

const main = (port = defaultPort) => {
  setUpDataBase();
  const server = new http.Server(app.serve.bind(app));
  server.listen(port, () => console.log(`listening to ${port} `));
};
const [, , port] = process.argv;
main(port);
