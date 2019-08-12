"use strict";

let MySQL = require(`mysql`);

module.exports = class RepositoryFactory {
  constructor(mapperFactory) {
    this.mapperFactory = mapperFactory;
  }

  getLightRepository() {
    let LightRepository = require(`./LightRepository.js`);
    return new LightRepository(this.mapperFactory.getLightCollectionMapper());
  }

  getMessageRepository() {
    let MessageRepository = require(`./MessageRepository.js`);
    return new MessageRepository(this.mapperFactory.getMessageCollectionMapper());
  }

  getDataRepository() {
    let DataRepository = require(`./DataRepository.js`);
    return new DataRepository(this.mapperFactory.getDataCollectionMapper());
  }

  getPersonRepository() {
    let PersonRepository = require(`./PersonRepository.js`);
    return new PersonRepository(this.mapperFactory.getPersonCollectionMapper());
  }

  getStatusRepository() {
    let StatusRepository = require(`./StatusRepository.js`);
    return new StatusRepository(this.mapperFactory.getStatusCollectionMapper());
  }

  getSentenceRepository() {
    let SentenceRepository = require(`./SentenceRepository.js`);
    return new SentenceRepository(this.mapperFactory.getSentenceCollectionMapper());
  }
}
