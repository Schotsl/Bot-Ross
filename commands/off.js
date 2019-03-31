module.exports = class Off extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "off";
  }

  executeCustom(input, message) {
    message.channel.send(language.respond('confirm', emotion));
    report.log(`${message.author.tag} (${message.author.id}) used the ".off" command`);

    let newLightOff = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setState(newLightOff.off()));
  }
}
