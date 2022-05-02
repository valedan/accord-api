import { TaskCollection, TaskResult, WorkflowParams } from "../../types";
import runTask from "../runTask";

// Subtasks are handled recursively by calling runTask again
const interpolateSubtasks = async (
  taskString: string,
  subtasks: TaskCollection,
  params: WorkflowParams,
  handleResult?: (result: TaskResult) => void
) => {
  // Captures all substrings enclosed by ${}
  const subtaskMatches = Array.from(taskString.matchAll(/\$\{([^}]+)\}/g));

  const subtaskOutputs = await Promise.all(
    subtaskMatches.map((match) =>
      runTask(match[1], subtasks, params, handleResult)
    )
  );

  let newTaskString = taskString;

  subtaskMatches.forEach((match, index) => {
    newTaskString = newTaskString.replace(match[0], subtaskOutputs[index]);
  });

  return newTaskString;
};

export default interpolateSubtasks;
