module.exports = class Person {
  constructor(id, hue) {
    this.id = "";
    this.first = "";
    this.last = "";
    this.email = "";
    this.adres = "";
    this.postal = "";
    this.city = "";
    this.birthday =
    this.insta = "";
    this.discord = "";
    this.twitter =
    this.ip = "";
  }

  getStatus(callback) {
    bot.fetchUser(this.discord).then((data) => {
      callback(data.presence.status);
    });
  }
}
