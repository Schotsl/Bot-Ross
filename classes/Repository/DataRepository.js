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
    if (typeof(data.label) !== `undefined`) query += `\`label\`, `;
    if (typeof(data.content) !== `undefined`) query += `\`content\`, `;
    if (typeof(data.version) !== `undefined`) query += `\`version\`, `;
    query = `${query.substring(0, query.length - 2)} ) VALUES (`;

    if (typeof(data.label) !== `undefined`) query += `'${data.label}', `;
    if (typeof(data.content) !== `undefined`) query += `'${data.content}', `;
    if (typeof(data.version) !== `undefined`) query += `'${data.version}', `;
    query = `${query.substring(0, query.length - 2)})`;

    connection.query(query, function(error, dataArray) {
      connection.query(`SELECT LAST_INSERT_ID()`, function(error, lastId) {
        data.setId(lastId[0][`LAST_INSERT_ID()`]);

        connection.end();
        if (callback) callback(data);
      });
    });
  }
}
