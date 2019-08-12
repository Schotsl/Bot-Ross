"use strict";

module.exports = class Data {
  constructor() {
    this.id;
    this.label;
    this.content;
    this.version;
  }

  setId(id) {
    this.id = id;
  }

  setLabel(label) {
    this.label = label;
  }

  setContent(content) {
    this.content = content;
  }

  setVersion(version) {
    this.version = version;
  }

  getId() {
    return this.id;
  }

  getLabel(label) {
    return this.label;
  }

  getContent() {
    return this.content;
  }

  getVersion() {
    return this.version;
  }
}
