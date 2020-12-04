import { getSettings } from "./helper.ts"

import { YoutubeAPI, Part } from "./youtube/index.ts";
import { TodoistAPI } from "./todoist/index.ts";

const settings = getSettings();
const todoistAPI = new TodoistAPI(settings.todoistToken!);
const youtubeAPI = new YoutubeAPI(settings.youtubeToken!);

setInterval(executeYoutube, 1000 * 60 * 60);
executeYoutube();

async function executeYoutube() {
  // Make sure there isn't already a 'Sort Youtube Music playlist'
  const tasks = await todoistAPI.getTask();
  for (let i = 0; i < tasks.length; i ++) {
    if (tasks[i].content === `Sort Youtube Music playlist`) return;
  }
  
  // If there are more or ten items
  const playlist = await youtubeAPI.getPlaylist(Part.Id, settings.youtubePlaylist!, 10);
  if (playlist.items.length >= 10) todoistAPI.addTask({ content: `Sort Youtube Music playlist` });
}