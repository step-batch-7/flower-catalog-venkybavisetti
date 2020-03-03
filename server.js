const fs = require('fs');
const { app } = require('./app');
const defaultPort = 4000;

const setUpDataBase = function() {
  const data = `${__dirname}/data`;
  if (!fs.existsSync(`${data}`)) {
    fs.mkdirSync(`${data}`);
  }
};

const main = port => {
  setUpDataBase();
  app.listen(port, () => console.log(`listening to ${port} `));
};
const port = process.env.PORT || defaultPort;
main(port);
