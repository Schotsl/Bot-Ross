let Person = require('./../Entity/Person.js');

module.exports = class RatingMapper {
  map(personObject, personArray) {
    if (typeof personArray.id != "undefined" && personArray.id != null) personObject.setId(personArray.id);
    if (typeof personArray.ip != "undefined" && personArray.ip != null) personObject.setIp(personArray.ip);
    if (typeof personArray.last != "undefined" && personArray.last != null) personObject.setLast(personArray.last);
    if (typeof personArray.city != "undefined" && personArray.city != null) personObject.setCity(personArray.city);
    if (typeof personArray.score != "undefined" && personArray.score != null) personObject.setScore(personArray.score);
    if (typeof personArray.first != "undefined" && personArray.first != null) personObject.setFirst(personArray.first);
    if (typeof personArray.email != "undefined" && personArray.email != null) personObject.setEmail(personArray.email);
    if (typeof personArray.insta != "undefined" && personArray.insta != null) personObject.setInsta(personArray.insta);
    if (typeof personArray.adres != "undefined" && personArray.adres != null) personObject.setAdress(personArray.adress);
    if (typeof personArray.postal != "undefined" && personArray.postal != null) personObject.setPostal(personArray.postal);
    if (typeof personArray.twitter != "undefined" && personArray.twitter != null) personObject.setTwitter(personArray.twitter);
    if (typeof personArray.discord != "undefined" && personArray.discord != null) personObject.setDiscord(personArray.discord);
    if (typeof personArray.birthday != "undefined" && personArray.birthday != null) personObject.setBirthday(personArray.birthday);

    return personObject;
  }

  createAndMap(personArray) {
    return this.map(new Person, personArray);
  }
}
