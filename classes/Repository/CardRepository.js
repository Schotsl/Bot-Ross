"use strict";

let MySQL = require(`mysql`);

module.exports = class CardRepository {
  constructor(cardCollectionMapper) {
    this.cardCollectionMapper = cardCollectionMapper;
  }

  getByDatetime(datetime, callback) {
    let currentDateObject = datetime;
    let tomorrowDateObject = new Date(datetime.getTime() + 86400000);

    let currentTimestamp = `${currentDateObject.getFullYear()}-${('0' + currentDateObject.getDate()).slice(-2)}-${('0' + (currentDateObject.getMonth() + 1)).slice(-2)} 00:00:00`;
    let tomorrowTimestamp = `${tomorrowDateObject.getFullYear()}-${('0' + tomorrowDateObject.getDate()).slice(-2)}-${('0' + (tomorrowDateObject.getMonth() + 1)).slice(-2)} 00:00:00`;

    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`send\`, \`person\`, \`datetime\`, \`template\`, \`destination\` FROM \`card\` WHERE \`datetime\` >= '${currentTimestamp}' AND \`datetime\` < '${tomorrowTimestamp}'`, function(error, cardsArray) {
      connection.end();
      callback(that.cardCollectionMapper.createAndMap(cardsArray));
    });
  }
}
