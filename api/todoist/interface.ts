interface Due {
  date: string;
  string: string;
  datetime?: string;
  timezone?: string;
}

interface Abstract {
  id?: number;
  order?: number;
}

export interface Section extends Abstract {
  "name": string;
  "project_id": number;
}

export interface Project extends Abstract {
  "name": string;
  "color"?: number;
  "shared"?: boolean;
  "sync_id"?: number;
  "favorite"?: boolean;
  "parent_id"?: number;
  "team_inbox"?: boolean;
  "comment_count"?: number;
  "inbox_project"?: boolean;
}

export interface Task extends Abstract {
  "due"?: Due;
  "url"?: string;
  "content": string;
  "due_lang"?: string;
  "priority"?: number;
  "assignee"?: number;
  "completed"?: boolean;
  "label_ids"?: number[];
  "parent_id"?: number;
  "due_string"?: string;
  "project_id"?: number;
  "section_id"?: number;
  "due_datetime"?: string;
  "comment_count"?: number;
}
