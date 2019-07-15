"use strict";

let HueApi = require(`node-hue-api`).HueApi;
let LightState = require("node-hue-api").lightState;

module.exports = class Light {
  constructor() {
    this.id;
    this.hue;
  }

  setId(id) {
    this.id = id;
  }

  setHue(hue) {
    this.hue = hue;
  }

  getId() {
    return this.id;
  }

  getHue() {
    return this.hue;
  }

  setState(newState, callback) {
    let that = this;
    let api = new HueApi(hueCredentials[`host`], hueCredentials[`username`]);

    api.setLightState(that.id, newState)
      .then((currentLight) => {
        report.log(`Light ${that.id}'s state has been set`);
        if (callback) callback(currentLight.state);
      })
      .fail((error) => report.error(error))
  }

  getState(callback) {
    let that = this;
    let api = new HueApi(hueCredentials[`host`], hueCredentials[`username`]);

    api.lightStatus(that.hue)
      .then((currentLight) => {
        report.log(`Light ${that.hue}'s state has been requested`);
        if (callback) callback(currentLight.state);
      })
      .fail((error) => report.error(error))
  }

  setRGB(red, green, blue, callback) {
    let newState = new LightState();
    newState.rgb(red, green, blue);
    this.setState(setRGB, callback);
  }
}
