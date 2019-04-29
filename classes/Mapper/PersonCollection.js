let PersonCollection = require('./../Collection/PersonCollection.js');

module.exports = class PersonCollectionMapper {
  constructor(personMapper) {
    this.personMapper = personMapper;
  }

  map(personCollectionObject, personsArray) {
    let that = this;
    
    personsArray.forEach(function(personArray) {
      let personObject = that.personMapper.createAndMap(personArray);
      personCollectionObject.addPerson(personObject);
    });

    return personCollectionObject;
  }

  createAndMap(personsArray) {
    return this.map(new PersonCollection, personsArray);
  }
}
