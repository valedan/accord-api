import { WorkflowParams } from "../../types";

const interpolateParams = (output: string, params: WorkflowParams) => {
  // Captures all substrings enclosed by @{}
  const paramMatches = Array.from(output.matchAll(/@\{([^}]+)\}/g));

  let newOutput = output;

  paramMatches.forEach((match) => {
    const paramValue = params[match[1]];

    if (!paramValue) {
      throw new Error(`Could not find param ${match[1]}`);
    }

    newOutput = newOutput.replace(match[0], paramValue);
  });

  return newOutput;
};

export default interpolateParams;
