import { TodoistAPI } from "./index.ts";
import { Abstract } from "./interface.ts";

export class TodoistTest {
  private todoistAPI: TodoistAPI;

  constructor(key: string) {
    this.todoistAPI = new TodoistAPI(key);
  }

  private findMatch(object: Abstract, array: Array<Abstract>): boolean {
    for (let i = 0; i < array.length; i ++) {
      if (array[i].id === object.id) return true;
    }
    
    return false;
  }

  public async testAll(verbose: boolean): Promise<boolean> {
    if (verbose) console.log(`[👏] Starting global Todoist API test`);

    const testResults = await Promise.all([
      this.testTask(verbose),
      this.testSection(verbose),
      this.testProject(verbose),
    ]);

    const summedResults = testResults[0] && testResults[1] && testResults[2];

    if (verbose) {
      if (!testResults[0]) console.log(`[👎] Something went wrong with the Task objects`);
      if (!testResults[1]) console.log(`[👎] Something went wrong with the Section objects`);
      if (!testResults[2]) console.log(`[👎] Something went wrong with the Project objects`);
      if (summedResults) console.log(`[👏] The global Todoist API test has completed succesfully`);
    }

    return summedResults;
  }

  private async testTask(verbose: boolean): Promise<boolean> {
    if (verbose) console.log(`[🧐] Inserting Task object`);
    const newTask = await this.todoistAPI.addTask({ content: `Test` });

    if (verbose) console.log(`[🧐] Validating Task insertion`);
    const insertResults = await this.todoistAPI.getTask();
    if (!this.findMatch(newTask, insertResults)) return false;
    if (verbose) console.log(`[👍] Validated Task insertion`);

    if (verbose) console.log(`[🧐] Deleting Task object`);
    await this.todoistAPI.deleteTask(newTask.id!);

    if (verbose) console.log(`[🧐] Validating Task deletion`);
    const deletionResults = await this.todoistAPI.getTask();
    if (this.findMatch(newTask, deletionResults)) return false;
    if (verbose) console.log(`[👍] Validated Task Deletion`);

    return true;
  }

  private async testSection(verbose: boolean) {
    if (verbose) console.log(`[⏰] Creating temporary Project for the Section test`);
    const newProject = await this.todoistAPI.addProject({ name: `Test` });

    if (verbose) console.log(`[🧐] Inserting Section object`);
    const newSection = await this.todoistAPI.addSection({ name: `Test`, project_id: newProject.id! });

    if (verbose) console.log(`[🧐] Validating Section insertion`);
    const insertResults = await this.todoistAPI.getSection();
    if (!this.findMatch(newSection, insertResults)) return false;
    if (verbose) console.log(`[👍] Validated Section insertion`);

    if (verbose) console.log(`[🧐] Deleting Section object`);
    await this.todoistAPI.deleteSection(newSection.id!);

    if (verbose) console.log(`[🧐] Validating Section deletion`);
    const deletionResults = await this.todoistAPI.getSection();
    if (this.findMatch(newSection, deletionResults)) return false;
    if (verbose) console.log(`[👍] Validated Section Deletion`);

    if (verbose) console.log(`[⏰] Cleaning-up temporary Project for the Section test`);
    await this.todoistAPI.deleteProject(newProject.id!);

    return true;
  }

  private async testProject(verbose: boolean) {
    if (verbose) console.log(`[🧐] Inserting Project object`);
    const newProject = await this.todoistAPI.addProject({ name: `Test` });

    if (verbose) console.log(`[🧐] Validating Project insertion`);
    const insertResults = await this.todoistAPI.getProject();
    if (!this.findMatch(newProject, insertResults)) return false;
    if (verbose) console.log(`[👍] Validated Project insertion`);

    if (verbose) console.log(`[🧐] Deleting Project object`);
    await this.todoistAPI.deleteProject(newProject.id!);

    if (verbose) console.log(`[🧐] Validating Project deletion`);
    const deletionResults = await this.todoistAPI.getProject();
    if (this.findMatch(newProject, deletionResults)) return false;
    if (verbose) console.log(`[👍] Validated Project Deletion`);

    return true;
  }
}