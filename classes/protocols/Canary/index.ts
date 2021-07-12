// Import local packages
import { Schema } from "./interface.ts";
import { Required } from "../../../enum.ts";
import { Settings } from "../../../interface.ts";
import { Abstraction } from "../../Protocol.ts";
import { globalDatabase } from "../../../database.ts";
import { repositoryPull, repositoryStatus } from "./helper.ts";

// Import packages from URL
import { walkSync } from "https://deno.land/std@0.78.0/fs/mod.ts";
import { isGitSync } from "https://deno.land/x/is_git@v0.1.1/mod.ts";
import { sendDirectMessage } from "https://deno.land/x/discordeno@10.0.1/mod.ts";

export class Canary implements Abstraction {
  public systemSettings: Settings = {};
  public requiredSettings = [Required.Discord];

  private directoryDepth = 1;
  private directoryPaths = [];
  private repositoryDatabase = globalDatabase.collection<Schema>("morgan");

  constructor(settingsObject: Settings) {
    this.systemSettings = settingsObject;
  }

  public async executeProtocol() {
    const repositories = [];

    // Get every single repository folder
    for (let i = 0; i < this.directoryPaths.length; i++) {
      const directory = this.directoryPaths[i];
      const children = walkSync(directory, { maxDepth: this.directoryDepth });

      for (const entry of children) {
        // Only add the folder if its a git repository
        const stat = await Deno.stat(entry.path);
        if (stat.isDirectory && isGitSync(entry.path)) {
          repositories.push(entry.path);
        }
      }
    }

    // Check the status of every repository
    for (let i = 0; i < repositories.length; i++) {
      const repository = repositories[i];
      const creation = Date.now();
      const files = await repositoryStatus(repository);

      // If there are no changed files pull the current branch
      if (files.length === 0) repositoryPull(repository);
      else {
        await this.repositoryDatabase.insertOne({
          repository,
          files,
          creation,
        });
      }
    }

    // Get every entry from the last 8 days
    const previous = Date.now() - 1000 * 60 * 60 * 24 * 8;
    const results = await this.repositoryDatabase.find({
      creation: { $gt: previous },
    });

    // Create a array with the name of every stored repository
    const uniques = [
      ...new Set(results.map((repository) => repository.repository)),
    ];
    const unchanged: string[] = [];

    // Check out every repository once
    uniques.forEach((unique) => {
      const datapoints = results.filter((result) =>
        result.repository === unique
      );
      datapoints.sort((a, b) => (a.creation > b.creation) ? 1 : -1);

      // Make sure there has been data for a week
      const oldest = results[0].creation;
      const newest = results[results.length - 1].creation;
      const difference = newest - oldest;
      if (difference < 1000 * 60 * 60 * 24 * 7) return;

      // Make sure ever datapoint is the same
      for (let i = 0; i < datapoints.length - 1; i++) {
        const current = datapoints[i];
        const upcoming = datapoints[i + 1];

        // We have to stringify since this is a deep array
        if (
          JSON.stringify(upcoming.files) !== JSON.stringify(current.files)
        ) {
          return;
        }
      }

      // If the repository has been unmodified for a week
      this.repositoryDatabase.deleteMany({ repository: unique });
      const directory = unique.replace(/^.*[\\\/]/, ``);
      unchanged.push(directory);
    });

    // Notifiy the user
    if (unchanged.length > 0) {
      const part = unchanged.join(`, `);
      const message = unchanged.length > 1
        ? `${part} have contained uncommited changes for more than a week!`
        : `${part} has contained uncommited changes for more than a week!`;

      sendDirectMessage(this.systemSettings.discordId!, message);
      sendDirectMessage(
        this.systemSettings.discordId!,
        `You might want to discard or commit these changes`,
      );
      console.log(`ℹ️ [${this.constructor.name}] Notified user`);
    }
  }
}
