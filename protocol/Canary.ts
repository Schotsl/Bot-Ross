import { Protocol } from "./Protocol.ts";
import { Settings } from "../interface.ts";
import { Required } from "../enum.ts";

import { Database } from "https://deno.land/x/aloedb/mod.ts";
import { walkSync } from "https://deno.land/std@0.78.0/fs/mod.ts";
import { moreThan } from "https://deno.land/x/aloedb@0.1.0/lib/operators.ts";
import { isGitSync } from "https://deno.land/x/is_git/mod.ts";
import { sendDirectMessage } from "https://deno.land/x/discordeno@10.0.1/mod.ts";

enum Status {
  Deleted = `deleted`,
  Modified = `modified`,
  Untracked = `untracked`,
}

type File = {
  status: Status;
  filename: string;
};

interface Schema {
  files: File[];
  creation: number;
  repository: string;
}

export class Canary implements Protocol {
  public requiredSettings = [Required.Discord];

  private discordId = ``;
  private directoryDepth = 1;
  private directoryPaths = [`/usr/local/var/www/Get\ Interactive`];
  private repositoryDatabase = new Database<Schema>("./database/canary.json");

  constructor(settings: Settings) {
    this.discordId = settings.discordId;
  }

  public async initializeProtocol() {
    // Execute the function once and set an interval
    console.log(`⌛ [${this.constructor.name}] Starting protocol`);
    setInterval(this.executeProtocol.bind(this), 1000 * 60 * 60);
    await this.executeProtocol();
    console.log(`🙌 [${this.constructor.name}] Started protocol`);
  }

  public async executeProtocol() {
    const repositories = [];

    // Get every single repository folder
    for (let i = 0; i < this.directoryPaths.length; i++) {
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
    for (let i = 0; i < repositories.length; i++) {
      const repository = repositories[i];
      const files = await this.repositoryStatus(repository);

      // If there are no changed files pull the current branch
      if (files.length === 0) {
        this.repositoryPull(repository);
      } else {
        const creation = Date.now();
        await this.repositoryDatabase.insertOne(
          { repository, files, creation },
        );
      }
    }

    // Get every entry from the last 8 days
    const previous = Date.now() - 1000 * 60 * 60 * 24 * 8;
    const results = await this.repositoryDatabase.findMany(
      { creation: moreThan(previous) },
    );

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
      const directory = unique.replace(/^.*[\\\/]/, "");
      unchanged.push(directory);
    });

    // Notifiy the user
    if (unchanged.length > 0) {
      const part = unchanged.join(`, `);
      const message = unchanged.length > 1
        ? `${part} have contained uncommited changes for more than a week!`
        : `${part} has contained uncommited changes for more than a week!`;

      sendDirectMessage(this.discordId, message);
      sendDirectMessage(
        this.discordId,
        `You might want to discard or commit these changes`,
      );
      console.log(`ℹ️ [${this.constructor.name}] Notified user`);
    }
  }

  private async repositoryPull(directory: string): Promise<void> {
    // Call the `git remote update` command
    let command = Deno.run({
      cmd: [
        `git`,
        `--git-dir=${directory}/.git`,
        `--work-tree=${directory}`,
        `remote`,
        `update`,
      ],
      stdout: `piped`,
      stderr: `piped`,
    });

    // Await the git update command
    await command.status();

    // Fetch the new commits if the working tree is clean
    command = Deno.run({
      cmd: [
        `git`,
        `--git-dir=${directory}/.git`,
        `--work-tree=${directory}`,
        `merge`,
        `--ff-only`,
      ],
      stdout: `piped`,
      stderr: `piped`,
    });
  }

  private async repositoryStatus(directory: string): Promise<Array<File>> {
    // Run the command through the terminal
    const command = Deno.run({
      cmd: [
        `git`,
        `--git-dir=${directory}/.git`,
        `--work-tree=${directory}`,
        `status`,
        `--porcelain`,
      ],
      stdout: `piped`,
      stderr: `piped`,
    });

    // Parse the output into a workable array
    const decoder = new TextDecoder();
    const output = await command.output();
    const decode = decoder.decode(output).trim();

    // Remove empty strings from the array
    let parts = decode.split(`\n`);
    parts = parts.filter(Boolean);

    // Map the array into the correct typed objects
    const files = parts.map((part) => {
      const trimmed = part.trim();
      const first = trimmed.charAt(0);

      if (first === `D`) {
        return {
          status: Status.Deleted,
          filename: trimmed.substr(1, trimmed.length),
        };
      }

      if (first === `D`) {
        return {
          status: Status.Modified,
          filename: trimmed.substr(1, trimmed.length),
        };
      }

      return {
        status: Status.Untracked,
        filename: trimmed.substr(2, trimmed.length),
      };
    });

    return files;
  }
}
