module.exports = class Off extends Command {
  constructor() {
    super();
    this.trigger = "off";
  }

  execute(input, message) {
    message.channel.send(language.respond('confirm', emotion));
    report.log(`"${message.author}" used the ".off" command`);

    let newLightOff = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setGroup(newLightOff.off()));
  }
}
