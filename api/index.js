const { createAppServer } = require('../src/app');

const server = createAppServer();

module.exports = (req, res) => {
  server.requestListener(req, res);
};
