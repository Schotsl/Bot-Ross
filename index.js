"use strict";

//Non constructors
global.functions = require(`./functions.js`);
global.loader = require(`./loader.js`);

//Custom classes
global.Events = require('events');
global.Report = require(`./classes/report.js`);
global.Command = require(`./classes/command.js`);
global.Protocol = require(`./classes/protocol.js`);

global.commandArray = new Array();
global.protocolArray = new Array();

global.report = new Report();
global.emitter = new Events.EventEmitter();

loader.loadCredentials();
loader.loadFactories();

require('./parsers/telegram.js');
require('./parsers/discord.js');

emitter.on('message', function(person, respond) {
  respond('yeet');
});
