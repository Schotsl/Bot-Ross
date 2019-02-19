module.exports = class Group {
  constructor(id, hue) {
    this.id = id;
    this.hue = hue;
  }

  getGroup(callback) {
    this.hue.getGroup(this.id)
      .then((currentLight) => {
        // let currentState = currentLight.state;
        // let lightStateString = currentState.on ? 'on' : 'off';
        //
        // report.log(`Light ${this.id} is ${lightStateString}`);
        console.log(currentLight);
        if (callback) callback(currentState);
      })
      .fail((error) => report.error(error))
      .done();
  }

  setGroup(newState, callback) {
    this.hue.setGroupLightState(this.id, newState)
      .then((currentLight) => {
        // let currentState = currentLight.state;
        // let lightStateString = newState.on ? 'on' : 'off';
        //
        // report.log(`Light ${this.id} has been turned ${lightStateString}`);
        if (callback) callback(currentState);
      })
      .fail((error) => report.error(error))
      .done();
  }
}
