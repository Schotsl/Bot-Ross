import { TodoistAPI } from "./index.ts";
import { initializeEnv } from "../../helper.ts";

initializeEnv(["TODOIST"]);

const todoistKey = Deno.env.get("TODOIST");
const todoistAPI = new TodoistAPI(todoistKey!);

Deno.test("Todoist task API", async () => {
  // Test the task related insertion and fetch requests
  const newTask = await todoistAPI.addTask({ content: `Test` });
  const insertResults = await todoistAPI.getTask();
  if (
    typeof insertResults.find((taskObject) => taskObject.id === newTask.id) ===
      "undefined"
  ) {
    throw Error("Todoist API couldn't insert or fetch tasks");
  }

  // Test the task related deletion and fetch requests
  await todoistAPI.deleteTask(newTask.id!);
  const deletionResults = await todoistAPI.getTask();
  if (
    typeof deletionResults.find((taskObject) =>
      taskObject.id === newTask.id
    ) !== "undefined"
  ) {
    throw Error("Todoist API couldn't delete or fetch tasks");
  }
});

Deno.test("Todoist project API", async () => {
  const newProject = await todoistAPI.addProject({ name: `Test` });
  const insertResults = await todoistAPI.getProject();
  if (
    typeof insertResults.find((projectObject) =>
      projectObject.id === newProject.id
    ) === "undefined"
  ) {
    throw Error("Todoist API couldn't insert or fetch projects");
  }

  await todoistAPI.deleteProject(newProject.id!);
  const deletionResults = await todoistAPI.getProject();
  if (
    typeof deletionResults.find((projectObject) =>
      projectObject.id === newProject.id
    ) !== "undefined"
  ) {
    throw Error("Todoist API couldn't delete or fetch projects");
  }
});

// This test suit relies on the Todoist project API
Deno.test("Todoist section API", async () => {
  // Create temporary project to test sections in
  const newProject = await todoistAPI.addProject({ name: `Test` });

  // Test the section related insertion and fetch requests
  const newSection = await todoistAPI.addSection(
    { name: `Test`, project_id: newProject.id! },
  );
  const insertResults = await todoistAPI.getSection();
  if (
    typeof insertResults.find((sectionObject) =>
      sectionObject.id === newSection.id
    ) === "undefined"
  ) {
    throw Error("Todoist API couldn't insert or fetch sections");
  }

  // Test the section related deletion and fetch requests
  await todoistAPI.deleteSection(newSection.id!);
  const deletionResults = await todoistAPI.getSection();
  if (
    typeof deletionResults.find((sectionObject) =>
      sectionObject.id === newSection.id
    ) !== "undefined"
  ) {
    throw Error("Todoist API couldn't delete or fetch sections");
  }

  // Clean up the temporary project
  await todoistAPI.deleteProject(newProject.id!);
});
