import { Playlist } from "./interface.ts";

export enum Part {
  Id = "id",
  Status = "status",
  Snippet = "snippet",
  ContentDetails = "contentDetails",
}

export class YoutubeAPI {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  private async getAbstract<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: `GET`,
    });

    return await response.json();
  }

  // GET

  public getPlaylist(
    part: Part,
    playlist: string,
    limit?: number,
    page?: string,
    video?: string,
  ): Promise<Playlist> {
    const parameters = new URLSearchParams({
      key: this.key,
      part: part,
      playlistId: playlist,
    });

    if (page) parameters.append("pageToken", page);
    if (video) parameters.append("videoId", video);
    if (limit) parameters.append("maxResults", limit.toString());

    return this.getAbstract(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?${parameters}`,
    );
  }
}
