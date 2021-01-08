import { Protocol } from "./Protocol.ts";

import { isGitSync } from "https://deno.land/x/is_git/mod.ts";
import { walkSync } from "https://deno.land/std@0.78.0/fs/mod.ts";

import { File, Settings } from "../interface.ts";
import { Status } from "../enum.ts";

export class Canary implements Protocol {
  public requiredSettings = [];

  private directoryDepth = 1;
  private directoryPaths = [`/usr/local/var/www/Get\ Interactive`];

  constructor(settings: Settings) {}

  public async initializeProtocol() {
    // Execute the function once and set an interval
    setInterval(this.executeProtocol.bind(this), 1000 * 60);
    await this.executeProtocol();
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
      if (files.length === 0) this.repositoryPull(repository);
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
