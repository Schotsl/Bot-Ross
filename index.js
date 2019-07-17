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
