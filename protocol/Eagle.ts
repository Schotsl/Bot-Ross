import { Protocol } from "./Protocol.ts";

import { Settings } from "../interface.ts";
import { TodoistAPI } from "../api/todoist/index.ts";
import { YoutubeAPI, Part } from "../api/youtube/index.ts";

export class Eagle implements Protocol {
  public required = [`todoist`, `youtube`];

  private todoistAPI: TodoistAPI;
  private youtubeAPI: YoutubeAPI;

  private songLimit = 10;
  private playlistId = `PLBmwW77rdwR3qDx6QrjVIWnlbtXUugXLw`;
  private todoistLabel = `Sort Youtube Music playlist`;

  constructor(settings: Settings) {
    this.youtubeAPI = new YoutubeAPI(settings.youtube);
    this.todoistAPI = new TodoistAPI(settings.todoist);
  }

  public async initialize() {
    // Execute the function once and set an interval
    setInterval(this.execute.bind(this), 10000);
    this.execute();
  }

  public async execute() {
    // Make sure there isn't already a taks with this label
    const tasks = await this.todoistAPI.getTask();
    for (let i = 0; i < tasks.length; i ++) {
      if (tasks[i].content === this.todoistLabel) return;
    }

    // If there are more or ten items
    const playlist = await this.youtubeAPI.getPlaylist(Part.Id, this.playlistId, this.songLimit);
    if (playlist.items.length >= 10) this.todoistAPI.addTask({ content: this.todoistLabel });
  }
}