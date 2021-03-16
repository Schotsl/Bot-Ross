import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

export class Label {
  public id?: string;
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
  public id?: string;
  public _id?: ObjectId;

  public image?: ObjectId | string;
  public lastname?: string;
  public firstname?: string;

  constructor(firstname: string, lastname: string, image?: string) {
    this.lastname = lastname;
    this.firstname = firstname;
  }
}

export class Mark {
  public id?: string;
  public _id?: ObjectId;

  public date?: string;
  public label?: ObjectId;

  constructor(label: ObjectId, date: string) {
    this.date = date;
    this.label = label;
  }
}

export class Taxonomy {
  public id?: string;
  public _id?: ObjectId;

  public title?: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class Image { 
  public id?: string;
  public _id?: ObjectId;
  
  public base64?: string;

  constructor(base64: string) {
    this.base64 = base64;
  }
}

export class Expense {
  public id?: string;
  public _id?: ObjectId;

  public date?: Date;
  public title?: string;
  public amount?: number;
  public optional?: boolean;
  public taxonomy?: ObjectId;
  public description?: string;
  public compensated?: boolean;
  public stakeholders?: Array<ObjectId>;

  constructor(
    date: Date,
    title: string,
    amount: number,
    taxonomy: ObjectId,
    description: string,
    stakeholders: Array<ObjectId>,
    optional: boolean = false,
    compensated: boolean = false,
  ) {
    this.date = date;
    this.title = title;
    this.amount = amount;
    this.optional = optional;
    this.taxonomy = taxonomy;
    this.compensated = compensated;
    this.description = description;
    this.stakeholders = stakeholders;
  }
}

export interface Settings {
  youtubeAPI?: string;
  todoistAPI?: string;
  discordAPI?: string;
  playlistId?: string;
  discordId?: string;
}

export interface Breakdown {
  taxonomy: Taxonomy,
  amount: number,
}
