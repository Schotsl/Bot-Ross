"use strict";

module.exports = class LightCollection {
  constructor() {
    this.lights = [];
  }

  addLight(light) {
    this.lights.push(light);
  }

  setLights(lights) {
    this.lights = lights;
  }

  getLights() {
    return this.lights;
  }
}
