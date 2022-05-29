import runTask from "./runTask/runTask";
import { ExecutableWorkflow } from "./types";

const runWorkflow = async (workflow: ExecutableWorkflow) => {
  return await runTask(workflow.entry_point, workflow);
};

export default runWorkflow;
