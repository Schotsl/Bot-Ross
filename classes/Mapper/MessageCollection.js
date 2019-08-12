"use strict";

let MessageCollection = require(`./../Collection/MessageCollection.js`);

module.exports = class MessageCollectionMapper {
  constructor(messageMapper) {
    this.messageMapper = messageMapper;
  }

  map(messageCollectionObject, messagesArray) {
    let that = this;

    //Something causes empty arrays to be parsed this is a hot fix
    if (typeof(messagesArray) !== `undefined` || messagesArray.length > 0) {
      messagesArray.forEach(function(messageArray) {
        let messageObject = that.messageMapper.createAndMap(messageArray);
        messageCollectionObject.addMessageObject(messageObject);
      });
    }

    return messageCollectionObject;
  }

  createAndMap(messagesArray) {
    return this.map(new MessageCollection, messagesArray);
  }
}
