export enum Status {
  Deleted = `deleted`,
  Modified = `modified`,
  Untracked = `untracked`,
}

export type File = {
  status: Status;
  filename: string;
};

export interface Schema {
  files: File[];
  creation: number;
  repository: string;
}