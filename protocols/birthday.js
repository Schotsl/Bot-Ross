"use strict";

module.exports = class Birthday extends Protocol {
  constructor() {
    super();
    this.protocols = [
      {name: `congratulate`, interval: {enabled: true, value: 24 * 60 * 60 * 1000}, function: `congratulate`, description: `Congratulate person on their birthday`}
    ];
  }

  congratulate() {
    report.log(`Checking for birthdays`);

    personRepository.getAll((personCollection) => {
      personCollection.getPersons().forEach((person) => {
        let tempBirthday = person.getBirthday();
        let tempDiscord = person.getDiscord();

        if (tempBirthday && tempDiscord) {
          let tempCurrent = new Date();
          if (tempBirthday.getDate() === tempCurrent.getDate() && tempBirthday.getMonth() === tempCurrent.getMonth()) {
            report.log(`Congratulated ${person.getFullname()}`);
            setTimeout(() => bot.users.get(tempDiscord).send(`This birthday I wish you happiness and love!`), 3000);
            setTimeout(() => bot.users.get(tempDiscord).send(`May all your dreams turn into reality and may lady luck visit your home today`), 6000);
            setTimeout(() => bot.users.get(tempDiscord).send(`Very happy birthday to one of the sweetest people ever known!`), 9000);
          }
        }
      });
    });
  }
}
