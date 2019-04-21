module.exports = class Light {
  constructor(id, hue) {
    this.last = "";
    this.email = "";
    this.first = "";
    this.number = "";
    this.discord = "";
  }

  getStatus(callback) {
    bot.fetchUser(this.discord).then((data) => {
      callback(data.presence.status);
    });
  }
}
