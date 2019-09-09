"use strict";

let CardCollection = require(`./../Collection/CardCollection.js`);

module.exports = class CardCollectionMapper {
  constructor(cardMapper) {
    this.cardMapper = cardMapper;
  }

  map(cardCollectionObject, cardsArray) {
    let that = this;

    //Something causes empty arrays to be parsed this is a hot fix
    if (typeof(cardsArray) !== `undefined` || cardsArray.length > 0) {
      cardsArray.forEach(function(cardArray) {
        let cardObject = that.cardMapper.createAndMap(cardArray);
        cardCollectionObject.addCardObject(cardObject);
      });
    }

    return cardCollectionObject;
  }

  createAndMap(cardsArray) {
    return this.map(new CardCollection, cardsArray);
  }
}
