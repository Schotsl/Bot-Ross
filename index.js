"use strict";

//Non constructors
global.fs = require(`fs`);
global.settings = require(`./settings.json`);
global.functions = require(`./functions.js`);

//Custom classes
global.Events = require('events');
global.Report = require(`./classes/report.js`);
global.Command = require(`./classes/command.js`);
global.Protocol = require(`./classes/protocol.js`);

//Credentials
const hueCredentialsLocation = `./credentials/hue.json`;
const mySQLCredentialsLocation = `./credentials/mysql.json`;
const discordCredentialsLocation = `./credentials/discord.json`;
const telegramCredentialsLocation = `./credentials/telegram.json`;

if (fs.existsSync(hueCredentialsLocation)) global.hueCredentials = require(hueCredentialsLocation);
if (fs.existsSync(mySQLCredentialsLocation)) global.mySQLCredentials = require(mySQLCredentialsLocation);
if (fs.existsSync(discordCredentialsLocation)) global.discordCredentials = require(discordCredentialsLocation);
if (fs.existsSync(telegramCredentialsLocation)) global.telegramCredentials = require(telegramCredentialsLocation);

global.commandArray = new Array();
global.protocolArray = new Array();

global.report = new Report();
global.emitter = new Events.EventEmitter();

global.getMapperFactory = function() {
  let MapperFactory = require(`./classes/Mapper/MapperFactory.js`);
  return new MapperFactory();
}

global.getRepositoryFactory = function() {
  let RepositoryFactory = require('./classes/Repository/RepositoryFactory.js');
  return new RepositoryFactory(getMapperFactory());
}

require('./parsers/telegram.js');
require('./parsers/discord.js');
