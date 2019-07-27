"use strict";

module.exports = class MessageCollection {
  constructor() {
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push(message);
  }

  setMessages(messages) {
    this.messages = messages;
  }

  getMessages() {
    return this.messages;
  }
}
