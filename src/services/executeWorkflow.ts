import { Task, Workflow } from "../types";

const executeTask = async (task: Task) => {
  return task.output;
};

const executeWorkflow = async (workflow: Workflow) => {
  const entryPointTask = workflow.tasks[workflow.entry_point];

  if (!entryPointTask) {
    throw new Error("Could not find entry point task");
  }

  const output = await executeTask(entryPointTask);

  return output;
};

export default executeWorkflow;
