"use strict";

module.exports = class Card {
  constructor() {
    this.id;
    this.send;
    this.person;
    this.datetime;
    this.template;
    this.destination;
  }

  setId(id) {
    this.id = id;
  }

  setSend(send) {
    this.send = send;
  }

  setPerson(person) {
    this.person = person;
  }

  setPerson(datetime) {
    this.datetime = datetime;
  }

  setTemplate(template) {
    this.template = template;
  }

  setDestination(destination) {
    this.destination = destination;
  }

  getId() {
    return this.id;
  }

  getSend() {
    return this.send;
  }

  getPerson() {
    return this.person;
  }

  getDatetime() {
    return this.datetime;
  }

  getTemplate() {
    return this.template;
  }

  getDestination() {
    return this.destination;
  }
}
