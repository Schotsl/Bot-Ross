"use strict";

module.exports = class SentenceCollection {
  constructor() {
    this.sentenceArray = [];
  }

  addSentenceObject(sentenceObject) {
    this.sentenceArray.push(sentenceObject);
  }

  addDataArray(sentenceArray) {
    this.sentenceArray.concat(sentenceArray);
  }

  setSentenceArray(sentenceArray) {
    this.sentenceArray = sentenceArray;
  }

  getSentenceArray() {
    return this.sentenceArray;
  }
}
