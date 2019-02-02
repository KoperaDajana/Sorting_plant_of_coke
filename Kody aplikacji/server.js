// pobranie z nodejs, wporwadza funkcjonalnosc
const http = require('http');
const app = require('./app');

// na tym powinien się odpalić, default port
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// zaczyna nasluchiwać na porcie
server.listen(port);