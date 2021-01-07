export interface Settings {
  youtube: string,
  todoist: string,
  playlist: string,
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

export interface Schema {
  name: string,
  enabled: boolean,
}