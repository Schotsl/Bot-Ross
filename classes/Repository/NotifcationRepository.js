"use strict";

let MySQL = require(`mysql`);

module.exports = class NotifcationRepository {
  constructor(notifcationCollectionMapper) {
    this.notifcationCollectionMapper = notifcationCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`datetime\`, \`type\`, \`content\` FROM \`notifications\` WHERE 1`, function(error, notifcationsArray) {
      connection.end();
      callback(that.notifcationCollectionMapper.createAndMap(notifcationsArray));
    });
  }

  deleteNotifcation(cardId, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`DELETE FROM \`notifications\` WHERE \`id\` = ${cardId}`, function(error) {
      connection.end();
      callback(true);
    });
  }
}
