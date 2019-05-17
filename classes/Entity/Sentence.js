module.exports = class Sentence {
  constructor() {
    this.id;
    this.value;
    this.content;
    this.intention;
  }

  setId(id) {
    this.id = id;
  }

  setValue(value) {
    this.value = value;
  }

  setContent(content) {
    this.content = content;
  }

  setIntention(intention) {
    this.intention = intention;
  }

  getId() {
    return this.id;
  }

  getValue() {
    return this.value;
  }

  getContent() {
    return this.content;
  }

  getIntention() {
    return this.intention;
  }
}
