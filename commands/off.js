module.exports = class Off extends Command {
  constructor() {
    super();
    this.trigger = "off";
  }

  execute(input) {
    let newLightOff = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setGroup(newLightOff.off()));
  }
}
