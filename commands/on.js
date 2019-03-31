module.exports = class On extends Command {
  constructor() {
    super();
    this.trigger = "on";
  }

  execute(input, message) {
    message.channel.send(language.respond('confirm', emotion));
    report.log(`"${message.author}" used the ".on" command`);

    let newLightOn = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setGroup(newLightOn.on()));
  }
}
