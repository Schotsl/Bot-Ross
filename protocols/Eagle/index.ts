import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { YouTube } from 'https://deno.land/x/youtube@v0.3.0/mod.ts';
import { TodoistAPI } from "../../api/todoist/index.ts";
import { initializeEnv } from "../../helper.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "BOT_ROSS_SERVER_YOUTUBE_TOKEN",
  "BOT_ROSS_SERVER_TODOIST_TOKEN",
  "BOT_ROSS_SERVER_PLAYLIST_ID",
]);

const youtubeToken = Deno.env.get("BOT_ROSS_SERVER_YOUTUBE_TOKEN")!;
const todoistToken = Deno.env.get("BOT_ROSS_SERVER_TODOIST_TOKEN")!;

export class Eagle {
  private youtube = new YouTube(youtubeToken, false);
  private todoist = new TodoistAPI(todoistToken);
  private playlist = Deno.env.get("BOT_ROSS_SERVER_PLAYLIST_ID");

  constructor(client: Client) { }

  public async execute() {
    const tasks = await this.todoist!.getTask();

    // Make sure there isn't already a taks with this label
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].content === `Sort Youtube Music playlist`) return;
    }

    const playlist = await this.youtube!.playlistItems_list({
      part: "id",
      playlistId: this.playlist,
      maxResults: 0
    });

    // If there are more or ten items
    if (playlist.pageInfo.totalResults >= 10) {
      this.todoist!.addTask({ content: `Sort Youtube Music playlist` });
    }
  }
}