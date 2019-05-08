let Person = require('./../Entity/Person.js');

module.exports = class RatingMapper {
  map(personObject, personArray) {
    if (typeof personArray.id != "undefined") personObject.setId(personArray.id);
    if (typeof personArray.ip != "undefined") personObject.setIp(personArray.ip);
    if (typeof personArray.last != "undefined") personObject.setLast(personArray.last);
    if (typeof personArray.city != "undefined") personObject.setCity(personArray.city);
    if (typeof personArray.score != "undefined") personObject.setScore(personArray.score);
    if (typeof personArray.first != "undefined") personObject.setFirst(personArray.first);
    if (typeof personArray.email != "undefined") personObject.setEmail(personArray.email);
    if (typeof personArray.insta != "undefined") personObject.setInsta(personArray.insta);
    if (typeof personArray.adres != "undefined") personObject.setAdress(personArray.adress);
    if (typeof personArray.postal != "undefined") personObject.setPostal(personArray.postal);
    if (typeof personArray.twitter != "undefined") personObject.setTwitter(personArray.twitter);
    if (typeof personArray.discord != "undefined") personObject.setDiscord(personArray.discord);
    if (typeof personArray.birthday != "undefined") personObject.setBirthday(personArray.birthday);
    
    return personObject;
  }

  createAndMap(personArray) {
    return this.map(new Person, personArray);
  }
}
