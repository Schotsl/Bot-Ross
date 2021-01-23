// Import packages local
import { Abstraction } from "../../Protocol.ts";
import { Required } from "../../../enum.ts";
import { Settings } from "../../../interface.ts";
import { TodoistAPI } from "../../../api/todoist/index.ts";
import { Part, YoutubeAPI } from "../../../api/youtube/index.ts";

// Import packages from URL
import { sendDirectMessage } from "https://deno.land/x/discordeno@10.0.1/mod.ts";

export class Eagle extends Abstraction {
  public systemSettings: Settings = { };
  public requiredSettings = [
    Required.Youtube,
    Required.Todoist,
    Required.Discord,
    Required.Playlist,
  ];

  private todoistAPI: TodoistAPI;
  private youtubeAPI: YoutubeAPI;
  private songLimit = 10;

  constructor(settingsObject: Settings) {
    super(settingsObject);
    this.systemSettings = settingsObject;
    this.youtubeAPI = new YoutubeAPI(settingsObject.youtubeAPI!);
    this.todoistAPI = new TodoistAPI(settingsObject.todoistAPI!);
  }

  public async executeProtocol() {
    // Make sure there isn't already a taks with this label
    const tasks = await this.todoistAPI.getTask();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].content === `Sort Youtube Music playlist`) return;
    }

    // If there are more or ten items
    const playlist = await this.youtubeAPI.getPlaylist(Part.Id, this.systemSettings.playlistId!, this.songLimit);
    if (playlist.items.length >= 10) {
      sendDirectMessage(this.systemSettings.discordId!, `I added a Todoist sort task`);
      this.todoistAPI.addTask({ content: `Sort Youtube Music playlist` });
      console.log(`ℹ️  [${this.constructor.name}] Added sorting task`);
    }
  }
}
