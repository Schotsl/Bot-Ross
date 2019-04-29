module.exports = class Person {
  constructor(id, hue) {
    this.id;
    this.first;
    this.last;
    this.email;
    this.adress;
    this.postal;
    this.city;
    this.birthday;
    this.insta;
    this.discord;
    this.twitter;
    this.ip;
  }

  setId(id) {
    this.id = id;
  }

  setFirst(first) {
    this.first = first;
  }

  setLast(last) {
    this.last = last;
  }

  setEmail(email) {
    this.email = email;
  }

  setAdress(adress) {
    this.adress = adress;
  }

  setPostal(postal) {
    this.postal = postal;
  }

  setCity(city) {
    this.city = city;
  }

  setBirthday(birthday) {
    this.birthday = birthday;
  }

  setInsta(insta) {
    this.insta = insta;
  }

  setDiscord(discord) {
    this.discord = discord;
  }

  setTwitter(twitter) {
    this.twitter = twitter;
  }

  setIp(ip) {
    this.ip = ip;
  }

  getId() {
    return this.id;
  }

  getFirst() {
    return this.first;
  }

  getLast() {
    return this.last;
  }

  getEmail() {
    return this.email;
  }

  getAdress() {
    return this.adress;
  }

  getPostal() {
    return this.postal;
  }

  getCity() {
    return this.city;
  }

  getBirthday() {
    return this.birthday;
  }

  getInsta() {
    return this.insta;
  }

  getDiscord() {
    return this.discord;
  }

  getTwitter() {
    return this.twitter;
  }

  getIp() {
    return this.ip;
  }

  getFullname() {
    return `${this.getFirst()} ${this.getLast()}`;
  }

  getDiscordStatus(callback) {
    let discord = this.getDiscord();

    bot.fetchUser(discord).then((data) => {
      callback(data.presence.status);
    });
  }
}
