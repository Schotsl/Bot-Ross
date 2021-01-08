import { Status } from "./enum.ts";

export interface Settings {
  youtubeAPI: string;
  todoistAPI: string;
  youtubePlaylist: string;
}

export interface File {
  status: Status;
  filename: string;
}

export interface Schema {
  name: string;
  enabled: boolean;
}
