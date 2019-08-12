"use strict";

module.exports = class MessageCollection {
  constructor() {
    this.messageArray = [];
  }

  addMessageObject(messageObject) {
    this.messageArray.push(messageObject);
  }

  addMessageArray(messageArray) {
    this.messageArray.concat(messageArray);
  }

  setMessageArray(messageArray) {
    this.messageArray = messageArray;
  }

  getMessageArray() {
    return this.messageArray;
  }
}
