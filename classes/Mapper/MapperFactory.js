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

  getMessageMapper() {
    let MessageMapper = require(`./Message.js`);
    return new MessageMapper();
  }

  getMessageCollectionMapper() {
    let MessageCollectionMapper = require(`./MessageCollection.js`);
    return new MessageCollectionMapper(this.getMessageMapper());
  }

  getDataMapper() {
    let DataMapper = require(`./Data.js`);
    return new DataMapper();
  }

  getDataCollectionMapper() {
    let DataCollectionMapper = require(`./DataCollection.js`);
    return new DataCollectionMapper(this.getDataMapper());
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

  getCardMapper() {
    let CardMapper = require(`./Card.js`);
    return new CardMapper();
  }

  getCardCollectionMapper() {
    let CardCollectionMapper = require(`./CardCollection.js`);
    return new CardCollectionMapper(this.getCardMapper());
  }
}
