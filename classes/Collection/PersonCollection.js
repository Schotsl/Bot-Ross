"use strict";

module.exports = class PersonCollection {
  constructor() {
    this.personArray = [];
  }

  addPersonObject(personObject) {
    this.personArray.push(personObject);
  }

  addPersonArray(personArray) {
    this.personArray.concat(personArray);
  }

  setPersonArray(personArray) {
    this.personArray = personArray;
  }

  getPersonArray() {
    return this.personArray;
  }
}
