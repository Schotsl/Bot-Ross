module.exports = class Light {
  constructor(id, hue) {
    this.id = id;
    this.hue = hue;
  }

  toggleLight(callback) {
    this.getState(function(currentState) {
      currentState.on = !currentState.on;
      this.setState(currentState, callback);
    });
  }

  setState(newState, callback) {
    this.hue.setLightState(this.id, newState)
      .then(function(currentLight) {
        report.log(`Light ${this.id}'s state has been set`);
        if (callback) callback(currentLight.state);
      })
      .fail((error) => report.error(error))
      .done();
  }

  getState(callback) {
    this.hue.lightStatus(this.id)
      .then(function(currentLight) {
        report.log(`Light ${this.id}'s state has been requested`);
        if (callback) callback(currentLight.state);
      })
      .fail((error) => report.error(error))
      .done();
  }
}
