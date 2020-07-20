const express = require('express');
const server = express();
const projectsRouter = require('./data/routers/projectsRouter');
const actionsRouter = require("./data/routers/actionsRouter.js");

server.use(express.json())

server.use(logger);

server.use('/api/projects', projectsRouter);
server.use("/api/actions", actionsRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Hi There! Let's get into some projects!</h2>`);
  const messageOfTheDay = process.env.MOTD || 'Hello World'
  res.status(200).json({ api: "up", motd: messageOfTheDay });
});

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method}, Location: ${req.url}, When: [${new Date().toISOString()}] `)
next();
}

module.exports = server;
