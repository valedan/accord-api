import { TaskCollection, TaskResult, WorkflowParams } from "../../types";
import interpolateParams from "./interpolateParams";
import interpolateSubtasks from "./interpolateSubtasks";

// Takes a taskString (eg a task output or a step instruction) and interpolates it with the given tasks and params
// e.g. `@{name} is a ${name_is_long_or_short}` would interpolate a param called `name` and a task called `name_is_long_or_short`
const interpolateTaskString = async (
  taskString: string,
  tasks: TaskCollection,
  params: WorkflowParams,
  handleResult?: (result: TaskResult) => void
) => {
  let newTaskString = taskString;

  newTaskString = await interpolateSubtasks(
    newTaskString,
    tasks,
    params,
    handleResult
  );

  newTaskString = interpolateParams(newTaskString, params);

  return newTaskString;
};

export default interpolateTaskString;
