let Person = require('./../Entity/Sentence.js');

module.exports = class SentenceMapper {
  map(sentenceObject, sentenceArray) {
    if (typeof sentenceArray.id != "undefined") sentenceObject.setId(sentenceArray.id);
    if (typeof sentenceArray.value != "undefined") sentenceObject.setValue(sentenceArray.value);
    if (typeof sentenceArray.content != "undefined") sentenceObject.setContent(sentenceArray.content);
    if (typeof sentenceArray.intention != "undefined") sentenceObject.setIntention(sentenceArray.intention);

    return sentenceObject;
  }

  createAndMap(sentenceArray) {
    return this.map(new Sentence, sentenceArray);
  }
}
