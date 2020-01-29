const http = require("http");
const { methods } = require("./app");

const requestListener = function(req, res) {
  console.log("Request: ", req.method, req.url);
  const handlerType = methods[req.method];
  const handler = handlerType[req.url] || handlerType.forAll;
  return handler(req, res);
};

const main = (port = 4000) => {
  const server = new http.Server(requestListener);
  server.listen(port, () => console.log(`listening to ${port} `));
};

main(process.argv[2]);
