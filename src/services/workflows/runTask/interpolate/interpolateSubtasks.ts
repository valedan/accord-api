import { TaskCollection, TaskResult, WorkflowParams } from "../../types";
import runTask from "../runTask";

// Subtasks are handled recursively by calling runTask again
const interpolateSubtasks = async (
  output: string,
  subtasks: TaskCollection,
  params: WorkflowParams,
  handleResult?: (result: TaskResult) => void
) => {
  // Captures all substrings enclosed by ${}
  const subtaskMatches = Array.from(output.matchAll(/\$\{([^}]+)\}/g));

  const subtaskOutputs = await Promise.all(
    subtaskMatches.map((match) =>
      runTask(match[1], subtasks, params, handleResult)
    )
  );

  let newOutput = output;

  subtaskMatches.forEach((match, index) => {
    newOutput = newOutput.replace(match[0], subtaskOutputs[index]);
  });

  return newOutput;
};

export default interpolateSubtasks;
