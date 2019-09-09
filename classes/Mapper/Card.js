"use strict";

let Card = require(`./../Entity/Card.js`);

module.exports = class CardMapper {
  constructor() {

  }

  map(cardObject, cardArray) {
    if (typeof(cardArray.id) !== `undefined` && cardArray.id !== null) cardObject.setId(cardArray.id);
    if (typeof(cardArray.send) !== `undefined` && cardArray.send !== null) cardObject.setSend(cardArray.send);
    if (typeof(cardArray.person) !== `undefined` && cardArray.person !== null) cardObject.setPerson(cardArray.person);
    if (typeof(cardArray.template) !== `undefined` && cardArray.template !== null) cardObject.setTemplate(cardArray.template);
    if (typeof(cardArray.destination) !== `undefined` && cardArray.destination !== null) cardObject.setDestination(cardArray.destination);

    return cardObject;
  }

  createAndMap(cardArray) {
    return this.map(new Card, cardArray);
  }
}
