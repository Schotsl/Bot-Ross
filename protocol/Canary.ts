import { isGitSync } from "https://deno.land/x/is_git/mod.ts";
import { walkSync } from "https://deno.land/std@0.78.0/fs/mod.ts";

import { repositoryPull, repositoryStatus } from "../helper.ts";
import { Settings } from "../interface.ts";

export class Canary {
  private directoryDepth = 1;
  private directoryPaths = [`/usr/local/var/www/Get\ Interactive`]

  constructor(settings: Settings) { }

  public async initialize() {
    // Execute the function once and set an interval
    setInterval(this.execute.bind(this), 1000 * 60);
    this.execute();
  }
  
  private async execute() {
    const repositories = [];

    // Get every single repository folder
    for (let i = 0; i < this.directoryPaths.length; i ++) {
      const directory = this.directoryPaths[i];
      const children = walkSync(directory, { maxDepth: this.directoryDepth });

      for (const entry of children) {
        const stat = await Deno.stat(entry.path);

        // Only add the folder if its a git repository
        if (stat.isDirectory && isGitSync(entry.path)) {
          repositories.push(entry.path);
        }
      }
    }

    // Check the status of every repository
    for (let i = 0; i < repositories.length; i ++) {
      const repository = repositories[i];
      const files = await repositoryStatus(repository);
      
      // If there are no changed files pull the current branch
      if (files.length === 0) repositoryPull(repository);
    }
  }
}