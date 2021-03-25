import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

export interface Taxonomy {
  id?: string;
  _id?: ObjectId;

  title?: string;
}

export interface Image {
  id?: string;
  _id?: ObjectId;

  base64: string;
}

export interface Contact {
  id?: string;
  _id?: ObjectId;

  image?: string;
  _image?: ObjectId;

  lastname: string;
  firstname: string;
}

export interface Expense {
  id?: string;
  _id?: ObjectId;

  contacts?: Array<Contact>;
  _contacts?: Array<ObjectId>;

  taxonomy?: Taxonomy;
  _taxonomy?: ObjectId;

  date: Date;
  title: string;
  amount: number;
  optional: boolean;
  description: string;
  compensated: boolean;
}

export interface ContactCollection {
  total: number;
  limit: number;
  offset: number;
  contacts: Array<Contact>;
}

export interface TaxonomyCollection {
  total: number;
  limit: number;
  offset: number;
  taxonomies: Array<Taxonomy>;
}

export interface ExpenseCollection {
  total: number;
  limit: number;
  offset: number;
  expenses: Array<Expense>;
}

export interface Settings {
  discordId?: string;
  youtubeAPI?: string;
  todoistAPI?: string;
  discordAPI?: string;
  playlistId?: string;
}
