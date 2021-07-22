interface Info {
  totalResults: number;
  resultsPerPage: number;
}

interface Resource {
  kind: string;
  videoId: string;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Thumbnails {
  high: Thumbnail;
  medium: Thumbnail;
  default: Thumbnail;
  maxres?: Thumbnail;
  standart?: Thumbnail;
}

interface Details {
  note: string;
  endAt: string;
  videoId: string;
  startAt: string;
  videoPublishedAt: Date;
}

interface Status {
  privacyStatus: string;
}

interface Snippet {
  title: string;
  position: number;
  channelId: string;
  playlistId: string;
  resourceId: Resource;
  thumbnails: Thumbnails;
  publishedAt: Date;
  description: string;
  channelTitle: string;
}

export interface Video {
  id: string;
  kind: string;
  etag: string;
  status?: Status;
  snippet?: Snippet;
  contentDetails?: Details;
}

export interface Playlist {
  kind: string;
  etag: string;
  items: Video[];
  pageInfo: Info;
  nextPageToken?: string;
  prevPageToken?: string;
}
