import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

export interface Settings {
  youtubeAPI?: string;
  todoistAPI?: string;
  discordAPI?: string;
  playlistId?: string;
  discordId?: string;
}

export interface Schema {
  name: string;
  enabled: boolean;
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
  ) {}
}

export class Contact {
  public _id?: ObjectId;
  public image?: string;
  public lastname?: string;
  public firstname?: string;

  constructor(firstname: string, lastname: string, image?: string) {}
}

export class Mark {
  public _id?: ObjectId;
  public date?: string;
  public label?: ObjectId;

  constructor(label: ObjectId, date: string) {}
}

export class Taxonomy {
  public _id?: ObjectId;
  public title?: string;

  constructor(title: string) {}
}
