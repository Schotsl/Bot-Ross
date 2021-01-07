export interface Settings {
  youtubeToken: string,
  todoistToken: string,
}

export enum Status {
  Deleted = `deleted`,
  Modified = `modified`,
  Untracked = `untracked`,
}

export interface File {
  status: Status,
  filename: string,
}

export interface Protocol {
  name: string,
  enabled: boolean,
}