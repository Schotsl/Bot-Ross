"use strict";

let PersonCollection = require(`./../Collection/PersonCollection.js`);

module.exports = class PersonCollectionMapper {
  constructor(personMapper) {
    this.personMapper = personMapper;
  }

  map(personCollectionObject, personsArray) {
    let that = this;

    //Something causes empty arrays to be parsed this is a hot fix
    if (typeof(personsArray) !== `undefined` || personsArray.length > 0) {
      personsArray.forEach(function(personArray) {
        let personObject = that.personMapper.createAndMap(personArray);
        personCollectionObject.addPersonObject(personObject);
      });
    }

    return personCollectionObject;
  }

  createAndMap(personsArray) {
    return this.map(new PersonCollection, personsArray);
  }
}
