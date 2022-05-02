import { TaskCollection, TaskResult, WorkflowParams } from "../../types";
import interpolateParams from "./interpolateParams";
import interpolateSubtasks from "./interpolateSubtasks";

const interpolateTaskString = async (
  taskString: string,
  subtasks: TaskCollection,
  params: WorkflowParams,
  handleResult?: (result: TaskResult) => void
) => {
  let newTaskString = taskString;
  newTaskString = await interpolateSubtasks(
    newTaskString,
    subtasks,
    params,
    handleResult
  );

  newTaskString = interpolateParams(newTaskString, params);

  return newTaskString;
};

export default interpolateTaskString;
