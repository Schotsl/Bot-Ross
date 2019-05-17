module.exports = class SentenceRepository {
  constructor(sentenceCollectionMapper) {
    this.sentenceCollectionMapper = sentenceCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`value\`, \`intention\`, \`content\` FROM \`languages\` WHERE 1`, function (error, sentencesArray) {
      connection.end();
      callback(that.sentenceCollectionMapper.createAndMap(sentencesArray));
    });
  }

  getClosestIntention(intention, value, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`content\` FROM \`languages\` WHERE \`intention\` = '${intention}' ORDER BY ABS ( \`value\` - ${value}) LIMIT 1`, function (error, sentencesArray) {
      connection.end();
      callback(that.sentenceCollectionMapper.createAndMap(sentencesArray));
    });
  }
}
