"use strict";

module.exports = class Log {
  constructor() {
    this.id;
    this.state
    this.person;
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

  getId() {
    return this.id;
  }

  getState() {
    return this.state;
  }

  getPerson(person) {
    return this.person;
  }
}
