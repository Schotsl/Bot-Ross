import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

export interface Settings {
  youtubeAPI?: string;
  todoistAPI?: string;
  discordAPI?: string;
  playlistId?: string;
  discordId?: string;
}

export class Label {
  public _id?: ObjectId;
  public emoji?: string;
  public title?: string;
  public offset?: number;
  public divider?: number;

  constructor(
    emoji: string,
    title: string,
    offset?: number,
    divider?: number,
  ) {
    this.emoji = emoji;
    this.title = title;
    this.offset = offset;
    this.divider = divider;
  }
}

export class Contact {
  public _id?: ObjectId;
  public image?: string;
  public lastname?: string;
  public firstname?: string;

  constructor(firstname: string, lastname: string, image?: string) {
    this.image = image;
    this.lastname = lastname;
    this.firstname = firstname;
  }
}

export class Mark {
  public _id?: ObjectId;
  public date?: string;
  public label?: ObjectId;

  constructor(label: ObjectId, date: string) {
    this.date = date;
    this.label = label;
  }
}

export class Taxonomy {
  public _id?: ObjectId;
  public title?: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class Expense {
  public _id?: ObjectId;
  public title?: string;
  public amount?: number;
  public crucial?: boolean;
  public taxonomy?: Taxonomy;
  public description?: string;
  public compensated?: boolean;
  public stakeholders?: Array<Contact>;
}