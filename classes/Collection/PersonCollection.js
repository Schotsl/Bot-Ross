"use strict";

module.exports = class PersonCollection {
  constructor() {
    this.persons = [];
  }

  addPerson(person) {
    this.persons.push(person);
  }

  setPersons(persons) {
    this.persons = persons;
  }

  getPersons() {
    return this.persons;
  }
}
