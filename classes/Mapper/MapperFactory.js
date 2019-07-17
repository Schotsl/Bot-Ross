"use strict";

module.exports = class MapperFactory {
  constructor() {

  }

  getLightMapper() {
    let LightMapper = require(`./Light.js`);
    return new LightMapper();
  }

  getLightCollectionMapper() {
    let LightCollectionMapper = require(`./LightCollection.js`);
    return new LightCollectionMapper(this.getLightMapper());
  }

  getLogMapper() {
    let LogMapper = require(`./Log.js`);
    return new LogMapper();
  }

  getLogCollectionMapper() {
    let LogCollectionMapper = require(`./LogCollection.js`);
    return new LogCollectionMapper(this.getLogMapper());
  }

  getPersonMapper() {
    let PersonMapper = require(`./Person.js`);
    return new PersonMapper();
  }

  getPersonCollectionMapper() {
    let PersonCollectionMapper = require(`./PersonCollection.js`);
    return new PersonCollectionMapper(this.getPersonMapper());
  }

  getSentenceMapper() {
    let SentenceMapper = require(`./Sentence.js`);
    return new SentenceMapper();
  }

  getSentenceCollectionMapper() {
    let SentenceCollectionMapper = require(`./SentenceCollection.js`);
    return new SentenceCollectionMapper(this.getSentenceMapper());
  }

  getStatusMapper() {
    let StatusMapper = require(`./Status.js`);
    return new StatusMapper();
  }

  getStatusCollectionMapper() {
    let StatusCollectionMapper = require(`./StatusCollection.js`);
    return new StatusCollectionMapper(this.getStatusMapper());
  }
}
