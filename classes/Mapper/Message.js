"use strict";

let Message = require(`./../Entity/Message.js`);

module.exports = class MessageMapper {
  constructor() {

  }

  map(messageObject, messageArray) {
    if (typeof(messageArray.id) !== `undefined` && messageArray.id !== null) messageObject.setId(messageArray.id);
    if (typeof(messageArray.person) !== `undefined` && messageArray.person !== null) messageObject.setPerson(messageArray.person);
    if (typeof(messageArray.content) !== `undefined` && messageArray.content !== null) messageObject.setContent(messageArray.content);

    return messageObject;
  }

  createAndMap(messageArray) {
    return this.map(new Message, messageArray);
  }
}
