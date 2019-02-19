module.exports = class Group {
  constructor(id, hue) {
    this.id = id;
    this.hue = hue;
  }

  getGroup(callback) {
    this.hue.getGroup(this.id)
      .then((currentLight) => {
        report.log(`Group ${this.id}'s state has been requested`);
        if (callback) callback(currentLight.state);
      })
      .fail((error) => report.error(error))
      .done();
  }

  setGroup(newState, callback) {
    this.hue.setGroupLightState(this.id, newState)
      .then((currentLight) => {
        report.log(`Group ${this.id}'s state has been requested`);
        if (callback) callback(currentLight.state);
      })
      .fail((error) => report.error(error))
      .done();
  }
}
