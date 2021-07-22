import { Project, Section, Task } from "./interface.ts";

export class TodoistAPI {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  private generateHeaders(): HeadersInit {
    return {
      // TODO: Use build in crypto uuid function
      "Authorization": `Bearer ${this.key}`,
      "Content-Type": `application/json`,
      "X-Request-Id": globalThis.crypto.randomUUID(),
    };
  }

  private async getAbstract<T>(url: string): Promise<T[]> {
    const response = await fetch(url, {
      method: `GET`,
      headers: this.generateHeaders(),
    });

    return await response.json();
  }

  private async addAbstract<T>(object: T, url: string): Promise<T> {
    const response = await fetch(url, {
      body: JSON.stringify(object),
      method: `POST`,
      headers: this.generateHeaders(),
    });

    return await response.json();
  }

  private async deleteAbstract(url: string): Promise<void> {
    await fetch(url, {
      method: `DELETE`,
      headers: this.generateHeaders(),
    });

    return;
  }

  // GET

  public getProject(): Promise<Project[]> {
    return this.getAbstract(`https://api.todoist.com/rest/v1/projects`);
  }

  public getSection(project?: number): Promise<Section[]> {
    const parameters = new URLSearchParams();

    if (project) parameters.append(`project_id`, project.toString());

    return this.getAbstract(
      `https://api.todoist.com/rest/v1/sections?${parameters}`,
    );
  }

  public getTask(
    project?: number,
    label?: number,
    filter?: string,
    language?: string,
    ids?: string,
  ): Promise<Task[]> {
    const parameters = new URLSearchParams();

    if (ids) parameters.append(`ids`, ids);
    if (label) parameters.append(`label_id`, label.toString());
    if (filter) parameters.append(`filter`, filter);
    if (project) parameters.append(`project_id`, project.toString());
    if (language) parameters.append(`lang`, language.toString());

    return this.getAbstract(
      `https://api.todoist.com/rest/v1/tasks?${parameters}`,
    );
  }

  // POST

  public addTask(task: Task): Promise<Task> {
    return this.addAbstract(task, `https://api.todoist.com/rest/v1/tasks`);
  }

  public addSection(section: Section): Promise<Section> {
    return this.addAbstract(
      section,
      `https://api.todoist.com/rest/v1/sections`,
    );
  }

  public addProject(project: Project): Promise<Project> {
    return this.addAbstract(
      project,
      `https://api.todoist.com/rest/v1/projects`,
    );
  }

  // DELETE

  public deleteProject(project: number): Promise<void> {
    return this.deleteAbstract(
      `https://api.todoist.com/rest/v1/projects/${project}`,
    );
  }

  public deleteSection(section: number): Promise<void> {
    return this.deleteAbstract(
      `https://api.todoist.com/rest/v1/sections/${section}`,
    );
  }

  public deleteTask(task: number): Promise<void> {
    return this.deleteAbstract(`https://api.todoist.com/rest/v1/tasks/${task}`);
  }
}
