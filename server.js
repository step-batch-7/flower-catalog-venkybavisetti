const { app } = require('./app');
const defaultPort = 4000;

const main = port => {
  app.listen(port, () => console.log(`listening to ${port} `));
};

const port = process.env.PORT || defaultPort;

main(port);
