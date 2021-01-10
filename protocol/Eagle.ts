import { sendDirectMessage } from "https://deno.land/x/discordeno@10.0.1/mod.ts";

import { Protocol } from "./Protocol.ts";
import { Required } from "../enum.ts";
import { Settings } from "../interface.ts";
import { TodoistAPI } from "../api/todoist/index.ts";
import { Part, YoutubeAPI } from "../api/youtube/index.ts";

export class Eagle implements Protocol {
  public requiredSettings = [
    Required.Youtube,
    Required.Todoist,
    Required.Discord,
    Required.Playlist,
  ];

  private todoistAPI: TodoistAPI;
  private youtubeAPI: YoutubeAPI;

  private songLimit = 10;
  private discordId = ``;
  private playlistId = ``;
  private discordLabel = `I added a Todoist sort task`;
  private todoistLabel = `Sort Youtube Music playlist`;

  constructor(settings: Settings) {
    this.discordId = settings.discordId;
    this.playlistId = settings.playlistId;
    this.youtubeAPI = new YoutubeAPI(settings.youtubeAPI);
    this.todoistAPI = new TodoistAPI(settings.todoistAPI);
  }

  public async initializeProtocol() {
    // Execute the function once and set an interval
    setInterval(this.executeProtocol.bind(this), 10000);
    await this.executeProtocol();
  }

  public async executeProtocol() {
    // Make sure there isn't already a taks with this label
    const tasks = await this.todoistAPI.getTask();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].content === this.todoistLabel) return;
    }

    // If there are more or ten items
    const playlist = await this.youtubeAPI.getPlaylist(
      Part.Id,
      this.playlistId,
      this.songLimit,
    );
    if (playlist.items.length >= 10) {
      sendDirectMessage(this.discordId, this.discordLabel);
      this.todoistAPI.addTask({ content: this.todoistLabel });
    }
  }
}
