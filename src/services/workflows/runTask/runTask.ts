import { TaskCollection, WorkflowParams } from "../types";
import interpolateParams from "./interpolateParams";
import interpolateSubtasks from "./interpolateSubtasks";
import runSteps from "./runSteps/runSteps";

const runTask = async (taskName: string, tasks: TaskCollection, params: WorkflowParams) => {
  const task = tasks[taskName];

  if (!task) {
    throw new Error(`Could not find task ${taskName}`);
  }

  // It's important to filter out the current task to prevent infinite recursion
  const otherTasks = Object.fromEntries(Object.entries(tasks).filter(([name]) => name !== taskName));

  let output = task.output || (await runSteps(task.steps, params));

  output = await interpolateSubtasks(output, otherTasks, params);
  output = interpolateParams(output, params);

  return output;
};

export default runTask;
