import { Task, Workflow } from "../types";

const runTask = async (task: Task) => {
  return task.output;
};

const runWorkflow = async (workflow: Workflow) => {
  const entryPointTask = workflow.tasks[workflow.entry_point];

  if (!entryPointTask) {
    throw new Error("Could not find entry point task");
  }

  const output = await runTask(entryPointTask);

  return output;
};

export default runWorkflow;
