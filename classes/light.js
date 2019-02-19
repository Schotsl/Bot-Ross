module.exports = class Light {
  constructor(id, hue) {
    this.id = id;
    this.hue = hue;
  }

  toggleLight(callback) {
    this.getState((currentState) => {
      currentState.on = !currentState.on;
      this.setState(currentState, callback);
    });
  }

  setState(newState, callback) {
    this.hue.setLightState(this.id, newState)
      .then((currentLight) => {
        let currentState = currentLight.state;
        let lightStateString = newState.on ? 'on' : 'off';

        report.log(`Light ${this.id} has been turned ${lightStateString}`);
        if (callback) callback(currentState);
      })
      .fail((error) => report.error(error))
      .done();
  }

  getState(callback) {
    this.hue.lightStatus(this.id)
      .then((currentLight) => {
        let currentState = currentLight.state;
        let lightStateString = currentState.on ? 'on' : 'off';

        report.log(`Light ${this.id} is ${lightStateString}`);
        if (callback) callback(currentState);
      })
      .fail((error) => report.error(error))
      .done();
  }
}
