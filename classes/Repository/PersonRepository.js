module.exports = class PersonRepository {
  constructor(personCollectionMapper) {
    this.personCollectionMapper = personCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`score\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE 1`, function (error, personsArray) {
      callback(that.personCollectionMapper.createAndMap(personsArray));
    });
    connection.end();
  }

  getByFirst(first, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`score\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE \`first\` LIKE '%${first}%'`, function (error, personsArray) {
      callback(that.personCollectionMapper.createAndMap(personsArray));
    });
    connection.end();
  }

  getByDiscord(discord, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`score\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE \`discord\` LIKE '%${discord}%'`, function (error, personsArray) {
      callback(that.personCollectionMapper.createAndMap(personsArray));
    });
    connection.end();
  }

  updateUser(user, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    let query = `UPDATE \`persons\` SET `;
    if (typeof user.ip != "undefined") query += `\`ip\` = '${user.ip}', `;
    if (typeof user.last != "undefined") query += `\`last\` = '${user.last}', `;
    if (typeof user.city != "undefined") query += `\`city\` = '${user.city}', `;
    if (typeof user.score != "undefined") query += `\`score\` = '${user.score}', `;
    if (typeof user.first != "undefined") query += `\`first\` = '${user.first}', `;
    if (typeof user.email != "undefined") query += `\`email\` = '${user.email}', `;
    if (typeof user.insta != "undefined") query += `\`insta\` = '${user.insta}', `;
    if (typeof user.adres != "undefined") query += `\`adress\` = '${user.adress}', `;
    if (typeof user.postal != "undefined") query += `\`postal\` = '${user.postal}', `;
    if (typeof user.twitter != "undefined") query += `\`twitter\` = '${user.twitter}', `;
    if (typeof user.discord != "undefined") query += `\`discord\` = '${user.discord}', `;
    if (typeof user.birthday != "undefined") query += `\`birthday\` = '${user.birthday.getFullYear()}-${user.birthday.getMonth() + 1}-${user.birthday.getDate()}', `;
    query = `${query.substring(0, query.length - 2)} WHERE \`id\` = '${user.id}'`;

    connection.query(query, function (error, personsArray) {
      if (callback) callback(user);
    });
    connection.end();
  }
}
