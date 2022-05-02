import runTask from "./runTask/runTask";
import { TaskResult, Workflow, WorkflowParams } from "./types";

const runWorkflow = async (
  workflow: Workflow,
  params: WorkflowParams = {},
  handleResult?: (result: TaskResult) => void
) => {
  const output = await runTask(
    workflow.entry_point,
    workflow.tasks,
    params,
    handleResult
  );

  return output;
};

export default runWorkflow;
