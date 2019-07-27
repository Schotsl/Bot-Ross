"use strict";

module.exports = class Message {
  constructor() {
    this.id;
    this.person;
    this.content;
    this.recieved;
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

  setRecieved(recieved) {
    this.recieved = recieved;
  }

  setDatetime(datetime) {
    this.datetime = datetime;
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

  getRecieved() {
    return this.recieved;
  }

  getDatetime() {
    return this.datetime;
  }
}
