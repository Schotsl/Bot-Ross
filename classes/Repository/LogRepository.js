"use strict";

module.exports = class LogRepository {
  constructor(logCollectionMapper) {
    this.logCollectionMapper = logCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`person\`, \`state\` FROM \`logs\` WHERE 1`, function(error, logsArray) {
      connection.end();
      callback(that.logCollectionMapper.createAndMap(logsArray));
    });
  }

  saveLog(log, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    let query = `INSERT INTO \`logs\` (`;
    if (typeof(log.person) !== `undefined`) query += `\`person\`, `;
    if (typeof(log.state) !== `undefined`) query += `\`state\`, `;
    query = `${query.substring(0, query.length - 2)} ) VALUES (`;

    if (typeof(log.person) !== `undefined`) query += `'${log.person}', `;
    if (typeof(log.state) !== `undefined`) query += `'${log.state}', `;
    query = `${query.substring(0, query.length - 2)})`;

    connection.query(query, function(error, personsArray) {
      connection.query(`SELECT LAST_INSERT_ID()`, function(error, lastId) {
        log.setId(lastId[0][`LAST_INSERT_ID()`]);

        if (callback) {
          connection.end();
          callback(log);
        }
      });
    });
  }
}
