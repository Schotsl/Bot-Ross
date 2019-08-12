"use strict";

//Non constructors
global.loader = require(`./loader.js`);
global.functions = require(`./functions.js`);

//Custom classes
global.Events = require('events');
global.Report = require(`./classes/report.js`);
global.Command = require(`./classes/command.js`);

global.commandArray = new Array();

global.report = new Report();
global.emitter = new Events.EventEmitter();

loader.loadCredentials();
loader.loadFactories();
loader.loadCommands();

global.platforms = [
  'telegram',
  'discord'
];

platforms.forEach(function(platform) {
  require(`./parsers/${platform}.js`);
});

global.emotionValue = 0;

emitter.on('message', function(message, respond, person) {
  //Parse command
  let splitMessage = message.split(" ");
  let command = splitMessage[0].substring(1);
  let params = splitMessage.slice(1);

  //Execute command
  commandArray.forEach((commandObject) => {
    commandObject.execute(command, params, message, respond, person);
  });
});

//Temp quick backend
const Express = require(`express`);

var bodyParser = require('body-parser')

// Create server
const app = Express();
app.use(Express.json());
app.listen(3000);
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//Status endpoint
app.get('/status/:personId', function(request, response) {
  let personId = request.params.personId;

  getRepositoryFactory().getStatusRepository().getByPerson(personId, function(results) {
    response.send(JSON.stringify(results));
  });
});

//Data endpoint
app.get('/data/:label', function(request, response) {
  let label = request.params.label;

  getRepositoryFactory().getDataRepository().getByLabel(label, function(results) {
    response.send(JSON.stringify(results));
  })
})

let Data = require('./classes/Entity/Data.js');

app.post('/data', function(request, response) {
  let content = request.body.content;
  let label = request.body.label;

  let newObject = new Data();
  newObject.setContent(content);
  newObject.setLabel(label);

  getRepositoryFactory().getDataRepository().saveData(newObject, function(dataObject) {
    response.send(JSON.stringify(dataObject));
  });
});


//Message endpoint
app.get('/message/:personId', function(request, response) {
  let personId = request.params.personId;

  getRepositoryFactory().getMessageRepository().getByPerson(personId, function(results) {
    response.send(JSON.stringify(results));
  });
});

app.get('/person', function(request, response) {
  getRepositoryFactory().getPersonRepository().getAll(function(results) {
    response.send(JSON.stringify(results));
  });
});

//Emotion endpoint
app.get('/emotion', function(request, response) {
  response.send(JSON.stringify(emotionValue));
});

app.patch('/emotion', function(request, response) {
  emotionValue = request.body.emotion;
  response.send(JSON.stringify(emotionValue));
});
