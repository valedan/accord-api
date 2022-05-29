import { ExecutableWorkflow } from "../../types";
import runTask from "../runTask";

// Subtasks are handled recursively by calling runTask again
const interpolateSubtasks = async (
  taskString: string,
  workflow: ExecutableWorkflow
) => {
  // Captures all substrings enclosed by ${}
  const subtaskMatches = Array.from(taskString.matchAll(/\$\{([^}]+)\}/g));

  const subtaskOutputs = await Promise.all(
    subtaskMatches.map((match) => runTask(match[1], workflow))
  );

  let newTaskString = taskString;

  subtaskMatches.forEach((match, index) => {
    newTaskString = newTaskString.replace(match[0], subtaskOutputs[index]);
  });

  return newTaskString;
};

export default interpolateSubtasks;
