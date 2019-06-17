"use strict";

let fs = require(`fs`);

module.exports = {
  loadCredentials: function() {
    report.log(`Loading credentials`);

    const hueCredentialsLocation = `./credentials/hue.json`;
    const mySQLCredentialsLocation = `./credentials/mysql.json`;
    const discordCredentialsLocation = `./credentials/discord.json`;
    const telegramCredentialsLocation = `./credentials/telegram.json`;

    //Core code credentials
    if (fs.existsSync(hueCredentialsLocation)) global.hueCredentials = require(hueCredentialsLocation);
    else report.fatal(`Hue credentials are missing`);

    if (fs.existsSync(mySQLCredentialsLocation)) global.mySQLCredentials = require(mySQLCredentialsLocation);
    else report.fatal(`MySQL credentials are missing`);

    //Communication platforms credentials
    if (fs.existsSync(discordCredentialsLocation)) global.discordCredentials = require(discordCredentialsLocation);
    else report.log(`Discord credentials are missing`);

    if (fs.existsSync(telegramCredentialsLocation)) global.telegramCredentials = require(telegramCredentialsLocation);
    else report.log(`Telegram credentials are missing`);

    report.log(`Successfully loaded credentials`);
  },
  loadFactories: function() {
    report.log(`Loading factories`);

    //Initialize mapper factory
    global.getMapperFactory = function() {
      let MapperFactory = require(`./classes/Mapper/MapperFactory.js`);
      return new MapperFactory();
    }

    //Initialize repository factory
    global.getRepositoryFactory = function() {
      let RepositoryFactory = require('./classes/Repository/RepositoryFactory.js');
      return new RepositoryFactory(getMapperFactory());
    }

    report.log(`Successfully loaded factories`);
  },
  loadCommands: function() {
    report.log(`Loading commands`);

    fs.readdirSync(`./commands`).forEach(file => {
      if (functions.getFileExtension(file) === `.js`) {
        let tempClass = require(`./commands/${file}`);
        let tempObject = new tempClass();
        commandArray.push(tempObject);
      }
    });

    report.log(`Successfully loaded commands`);
  }
}
