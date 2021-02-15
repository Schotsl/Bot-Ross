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

export interface Label {
  id: ObjectId;
  emoji: string;
  title: string;
}

export interface Mark {
  id: ObjectId;
  date: string;
  label: ObjectId;
}
