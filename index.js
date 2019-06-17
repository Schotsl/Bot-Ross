"use strict";

// TODO's:
// - Fix naming of object/array/collections
// - Fix discord user properties
// - Store query in variable
// - Double check class naming

global.emotionValue = 0;
global.emotionState = 0;

//Other packages
global.Discord = require(`discord.js`);
global.Sentiment = require(`sentiment`);

//Non constructors
global.fs = require(`fs`);
global.settings = require(`./settings.json`);
global.functions = require(`./functions.js`);

//Custom classes
global.Report = require(`./classes/report.js`);
global.Command = require(`./classes/command.js`);
global.Protocol = require(`./classes/protocol.js`);

global.report = new Report();
global.sentiment = new Sentiment();

//Credentials
const hueCredentialsLocation = `./credentials/hue.json`;
const mySQLCredentialsLocation = `./credentials/mysql.json`;
const discordCredentialsLocation = `./credentials/discord.json`;

if (fs.existsSync(hueCredentialsLocation)) global.hueCredentials = require(hueCredentialsLocation);
if (fs.existsSync(mySQLCredentialsLocation)) global.mySQLCredentials = require(mySQLCredentialsLocation);
if (fs.existsSync(discordCredentialsLocation)) global.discordCredentials = require(discordCredentialsLocation);

global.bot = new Discord.Client();
global.commandArray = new Array();
global.protocolArray = new Array();

global.getMapperFactory = function() {
  let MapperFactory = require(`./classes/Mapper/MapperFactory.js`);
  return new MapperFactory();
}

global.getRepositoryFactory = function() {
  let RepositoryFactory = require('./classes/Repository/RepositoryFactory.js');
  return new RepositoryFactory(getMapperFactory());
}

// get the reference of EventEmitter class of events module
var events = require('events');

//create an object of EventEmitter class by using above reference
var em = new events.EventEmitter();

//Subscribe for FirstEvent
em.on('FirstEvent', function (data) {
    console.log('First subscriber: ' + data);
});

// Raising FirstEvent
em.emit('FirstEvent', 'This is my first Node.js event emitter example.');
