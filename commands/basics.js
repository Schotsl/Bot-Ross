"use strict";

module.exports = class Basics extends Command {
  constructor() {
    super();
    this.commands = [{
      trigger: `help`,
      function: `help`,
      description: `Get all available commands`,
      timeout: 1000,
      executed: {},
      hidden: false
    }];
  }

  help(input, message, respond, person) {
    let helpReply = `\`\`\``;

    commandArray.forEach((commandObject) => {
      commandObject.commands.forEach((commandArray) => {
        if (!commandArray.hidden) helpReply += `${commandArray.trigger}: ${commandArray.description}\n`;
      });
    });
    helpReply += `\`\`\``;

    respond(helpReply);
  }
}
