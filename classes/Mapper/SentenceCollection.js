"use strict";

let SentenceCollection = require(`./../Collection/SentenceCollection.js`);

module.exports = class SentenceCollectionMapper {
  constructor(sentenceMapper) {
    this.sentenceMapper = sentenceMapper;
  }

  map(sentenceCollectionObject, sentencesArray) {
    let that = this;

    //Something causes empty arrays to be parsed this is a hot fix
    if (typeof(sentencesArray) !== `undefined` || sentencesArray.length > 0) {
      sentencesArray.forEach(function(sentenceArray) {
        let sentenceObject = that.sentenceMapper.createAndMap(sentenceArray);
        sentenceCollectionObject.addSentence(sentenceObject);
      });
    }

    return sentenceCollectionObject;
  }

  createAndMap(sentencesArray) {
    return this.map(new SentenceCollection, sentencesArray);
  }
}
