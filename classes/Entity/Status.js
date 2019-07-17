"use strict";

module.exports = class Status {
  constructor() {
    this.id;
    this.state;
    this.person;
    this.platform;
  }

  setId(id) {
    this.id = id;
  }

  setState(state) {
    this.state = state;
  }

  setPerson(person) {
    this.person = person;
  }

  setPlatform(platform) {
    if (platforms.includes(platform)) this.platform = platform;
    else report.error(`Unsupported platform (${platform}) has been attempted to set`);
  }

  getId() {
    return this.id;
  }

  getState() {
    return this.state;
  }

  getPerson() {
    return this.person;
  }

  getPlatform() {
    return this.platform;
  }
}
