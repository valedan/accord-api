import { ExecutableWorkflow } from "../types";
import { interpolateTaskString } from "./interpolate";
import runSteps from "./runSteps/runSteps";

const workflowWithoutTask = (
  taskName: string,
  workflow: ExecutableWorkflow
) => ({
  ...workflow,
  tasks: Object.fromEntries(
    Object.entries(workflow.tasks).filter(([name]) => name !== taskName)
  ),
});

const runTask = async (taskName: string, workflow: ExecutableWorkflow) => {
  const task = workflow.tasks[taskName];

  if (!task) {
    throw new Error(`Could not find task ${taskName}`);
  }

  const stepOutput = await runSteps(taskName, workflow);

  const output = await interpolateTaskString(
    // If the task has no output, use the output of the last step
    task.output || stepOutput,
    // It's important to filter out the current task to prevent infinite recursion
    workflowWithoutTask(taskName, workflow)
  );

  if (workflow.handleResult) {
    workflow.handleResult({
      task: taskName,
      step: "output",
      result: output,
    });
  }

  return output;
};

export default runTask;
