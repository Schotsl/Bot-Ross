"use strict";

let Sentence = require(`./../Entity/Sentence.js`);

module.exports = class SentenceMapper {
  constructor() {

  }

  map(sentenceObject, sentenceArray) {
    if (typeof(sentenceArray.id) !== `undefined` && sentenceArray.id !== null) sentenceObject.setId(sentenceArray.id);
    if (typeof(sentenceArray.value) !== `undefined` && sentenceArray.value !== null) sentenceObject.setValue(sentenceArray.value);
    if (typeof(sentenceArray.content) !== `undefined` && sentenceArray.content !== null) sentenceObject.setContent(sentenceArray.content);
    if (typeof(sentenceArray.intention) !== `undefined` && sentenceArray.intention !== null) sentenceObject.setIntention(sentenceArray.intention);

    return sentenceObject;
  }

  createAndMap(sentenceArray) {
    return this.map(new Sentence, sentenceArray);
  }
}
