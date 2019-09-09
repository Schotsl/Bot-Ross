"use strict";

module.exports = class CardCollection {
  constructor() {
    this.cardArray = [];
  }

  addCardObject(cardObject) {
    this.cardArray.push(cardObject);
  }

  addCardArray(cardArray) {
    this.cardArray.concat(cardArray);
  }

  setCardArray(cardArray) {
    this.cardArray = cardArray;
  }

  getCardArray() {
    return this.cardArray;
  }
}
