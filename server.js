const http = require('http');
const { app } = require('./handlers');
const defaultPort = 4000;

const main = (port = defaultPort) => {
  const server = new http.Server(app.serve.bind(app));
  server.listen(port, () => console.log(`listening to ${port} `));
};
const [, , port] = process.argv;
main(port);
