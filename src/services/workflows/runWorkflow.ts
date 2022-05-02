import runTask from "./runTask/runTask";
import { Workflow, WorkflowParams } from "./types";

const runWorkflow = async (workflow: Workflow, params: WorkflowParams = {}) => {
  const output = await runTask(workflow.entry_point, workflow.tasks, params);

  return output;
};

export default runWorkflow;
