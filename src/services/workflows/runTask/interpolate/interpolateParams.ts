import { WorkflowParams } from "../../types";

const interpolateParams = (taskString: string, params: WorkflowParams) => {
  // Captures all substrings enclosed by @{}
  const paramMatches = Array.from(taskString.matchAll(/@\{([^}]+)\}/g));

  let newTaskString = taskString;

  paramMatches.forEach((match) => {
    const paramValue = params[match[1]];

    if (!paramValue) {
      throw new Error(`Could not find param ${match[1]}`);
    }

    newTaskString = newTaskString.replace(match[0], paramValue);
  });

  return newTaskString;
};

export default interpolateParams;
