module.exports = class SentenceCollection {
  constructor() {
    this.sentences = [];
  }

  addSentence(sentence) {
    this.sentences.push(sentence);
  }

  setSentences(sentences) {
    this.sentences = sentences;
  }

  getSentences() {
    return this.sentences;
  }
}
