let Person = require('./../Entity/Person.js');

module.exports = class RatingMapper {
  map(personObject, personArray) {
    if (personArray.id) personObject.setId(personArray.id);
    if (personArray.ip) personObject.setIp(personArray.ip);
    if (personArray.last) personObject.setLast(personArray.last);
    if (personArray.city) personObject.setCity(personArray.city);
    if (personArray.first) personObject.setFirst(personArray.first);
    if (personArray.email) personObject.setEmail(personArray.email);
    if (personArray.insta) personObject.setInsta(personArray.insta);
    if (personArray.adres) personObject.setAdress(personArray.adress);
    if (personArray.postal) personObject.setPostal(personArray.postal);
    if (personArray.twitter) personObject.setTwitter(personArray.twitter);
    if (personArray.discord) personObject.setDiscord(personArray.discord);
    if (personArray.birthday) personObject.setBirthday(personArray.birthday);

    return personObject;
  }

  createAndMap(personArray) {
    return this.map(new Person, personArray);
  }
}
