import { TaskCollection, TaskResult, WorkflowParams } from "../types";
import { interpolateTaskString } from "./interpolate";
import runSteps from "./runSteps/runSteps";

// TODO: runTask, runSteps, and interpolateTaskString have a lot of overlap in their arguments
//  Consider combining the overlapping args into an object called `intermediateResults` or something
const runTask = async (
  taskName: string,
  tasks: TaskCollection,
  params: WorkflowParams,
  handleResult?: (result: TaskResult) => void
) => {
  const task = tasks[taskName];

  if (!task) {
    throw new Error(`Could not find task ${taskName}`);
  }

  // It's important to filter out the current task to prevent infinite recursion
  const otherTasks = Object.fromEntries(
    Object.entries(tasks).filter(([name]) => name !== taskName)
  );

  const stepOutput = await runSteps(
    task.steps,
    otherTasks,
    params,
    taskName,
    handleResult
  );

  const output = await interpolateTaskString(
    task.output || stepOutput, // If the task has no output, use the output of the last step
    otherTasks,
    params,
    handleResult
  );

  if (handleResult) {
    handleResult({ task: taskName, step: "output", result: output });
  }

  return output;
};

export default runTask;
