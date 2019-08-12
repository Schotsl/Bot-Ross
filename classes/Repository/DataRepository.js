"use strict";

let MySQL = require(`mysql`);

module.exports = class DataRepository {
  constructor(dataCollectionMapper) {
    this.dataCollectionMapper = dataCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`content\`, \`label\`, \`version\` FROM \`data\` WHERE 1`, function(error, datasArray) {
      connection.end();
      callback(that.dataCollectionMapper.createAndMap(datasArray));
    });
  }

  getByLabel(label, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`content\`, \`label\`, \`version\` FROM \`data\` WHERE \`label\` LIKE '%${label}%'`, function(error, datasArray) {
      connection.end();
      callback(that.dataCollectionMapper.createAndMap(datasArray));
    });
  }

  saveData(data, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    let query = `INSERT INTO \`data\` (`;
    if (typeof(message.label) !== `undefined`) query += `\`label\`, `;
    if (typeof(message.content) !== `undefined`) query += `\`content\`, `;
    if (typeof(message.version) !== `undefined`) query += `\`version\`, `;
    query = `${query.substring(0, query.length - 2)} ) VALUES (`;

    if (typeof(message.label) !== `undefined`) query += `'${message.label}', `;
    if (typeof(message.content) !== `undefined`) query += `'${message.content}', `;
    if (typeof(message.version) !== `undefined`) query += `'${message.version}', `;
    query = `${query.substring(0, query.length - 2)})`;

    connection.query(query, function(error, dataArray) {
      connection.query(`SELECT LAST_INSERT_ID()`, function(error, lastId) {
        data.setId(lastId[0][`LAST_INSERT_ID()`]);

        if (callback) {
          connection.end();
          callback(message);
        }
      });
    });
  }
}
