"use strict";

module.exports = class Notifcation {
  constructor() {
    this.id;
    this.type;
    this.content;
    this.datetime;
  }

  setId(id) {
    this.id = id;
  }

  setType(type) {
    this.type = type;
  }

  setContent(content) {
    this.content = content;
  }

  setDatetime(datetime) {
    this.datetime = datetime;
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getContent() {
    return this.content;
  }

  getDatetime() {
    return this.datetime;
  }
}
