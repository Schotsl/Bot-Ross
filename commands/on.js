module.exports = class On extends Command {
  constructor() {
    super();
    this.trigger = "on";
  }

  execute(input) {
    let newLightOn = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setGroup(newLightOn.on()));
  }
}
