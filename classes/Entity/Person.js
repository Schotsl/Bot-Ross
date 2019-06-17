"use strict";

module.exports = class Person {
  constructor() {
    this.id;
    this.score;
    this.first;
    this.last;
    this.email;
    this.adress;
    this.postal;
    this.city;
    this.birthday;
    this.insta;
    this.discord;
    this.telegram;
    this.twitter;
    this.ip;
  }

  setId(id) {
    this.id = id;
  }

  setScore(score) {
    this.score = score;
  }

  setFirst(first) {
    this.first = first;
  }

  setLast(last) {
    this.last = last;
  }

  setEmail(email) {
    this.email = email;
  }

  setAdress(adress) {
    this.adress = adress;
  }

  setPostal(postal) {
    this.postal = postal;
  }

  setCity(city) {
    this.city = city;
  }

  setBirthday(birthday) {
    this.birthday = birthday;
  }

  setInsta(insta) {
    this.insta = insta;
  }

  setDiscord(discord) {
    this.discord = discord;
  }

  setTelegram(telegram) {
    this.telegram = telegram;
  }

  setTwitter(twitter) {
    this.twitter = twitter;
  }

  setIp(ip) {
    this.ip = ip;
  }

  getId() {
    return this.id;
  }

  getScore() {
    return this.score;
  }

  getFirst() {
    return this.first;
  }

  getLast() {
    return this.last;
  }

  getEmail() {
    return this.email;
  }

  getAdress() {
    return this.adress;
  }

  getPostal() {
    return this.postal;
  }

  getCity() {
    return this.city;
  }

  getBirthday() {
    return this.birthday;
  }

  getInsta() {
    return this.insta;
  }

  getDiscord() {
    return this.discord;
  }

  getTelegram() {
    return this.telegram;
  }

  getTwitter() {
    return this.twitter;
  }

  getIp() {
    return this.ip;
  }

  getFullname() {
    return `${this.getFirst()} ${this.getLast()}`;
  }

  addScore(score) {
    this.score += score;
  }
}
