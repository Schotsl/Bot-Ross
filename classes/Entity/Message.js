"use strict";

module.exports = class Message {
  constructor() {
    this.id;
    this.person;
    this.content;
  }

  setId(id) {
    this.id = id;
  }

  setPerson(person) {
    this.person = person;
  }

  setContent(content) {
    this.content = content;
  }

  getId() {
    return this.id;
  }

  getPerson(person) {
    return this.person;
  }

  getContent() {
    return this.content;
  }
}
