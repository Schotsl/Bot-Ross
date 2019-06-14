"use strict";

module.exports = class RepositoryFactory {
  constructor(mapperFactory) {
    this.mapperFactory = mapperFactory;
  }

  getLightRepository() {
    let LightRepository = require(`./LightRepository.js`);
    return new LightRepository(this.mapperFactory.getLightCollectionMapper());
  }

  getLogRepository() {
    let LogRepository = require(`./LogRepository.js`);
    return new LogRepository(this.mapperFactory.getLogCollectionMapper());
  }

  getPersonRepository() {
    let PersonRepository = require(`./PersonRepository.js`);
    return new PersonRepository(this.mapperFactory.getPersonCollectionMapper());
  }

  getSentenceRepository() {
    let SentenceRepository = require(`./SentenceRepository.js`);
    return new SentenceRepository(this.mapperFactory.getSentenceCollectionMapper());
  }
}
