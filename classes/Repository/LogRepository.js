"use strict";

module.exports = class LogRepository {
  constructor(logCollectionMapper) {
    this.logCollectionMapper = logCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`person\`, \`state\` FROM \`logs\` WHERE 1`, function (error, logsArray) {
      connection.end();
      callback(that.logCollectionMapper.createAndMap(logsArray));
    });
  }
}
