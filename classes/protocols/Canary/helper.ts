import { File, Status } from "./interface.ts";

export async function repositoryStatus(
  directory: string,
): Promise<Array<File>> {
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

export async function repositoryPull(directory: string): Promise<void> {
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
