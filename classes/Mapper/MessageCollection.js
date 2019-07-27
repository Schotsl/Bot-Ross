"use strict";

let MessageCollection = require(`./../Collection/MessageCollection.js`);

module.exports = class MessageCollectionMapper {
  constructor(messageMapper) {
    this.messageMapper = messageMapper;
  }

  map(messageCollectionObject, messagesArray) {
    let that = this;

    messagesArray.forEach(function(messageArray) {
      let messageObject = that.messageMapper.createAndMap(messageArray);
      messageCollectionObject.addMessage(messageObject);
    });

    return messageCollectionObject;
  }

  createAndMap(messagesArray) {
    return this.map(new MessageCollection, messagesArray);
  }
}
