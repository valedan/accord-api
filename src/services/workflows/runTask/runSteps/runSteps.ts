import {
  ExecutableWorkflow, isGreaterThanStep, isIfStep, isLengthStep, isWaitStep
} from "../../types";
import { interpolateTaskString } from "../interpolate";
import { greaterThan, ifCondition, length, wait } from "./steps";

// Eventually we may need to handle steps that output arrays or objects, but for now all of our steps are simple.
type StepOutput = string | number | boolean;

const workflowWithStepParams = (
  workflow: ExecutableWorkflow,
  previousStepOutput: StepOutput
) => {
  // Steps receive the output of the previous step as an additional param called "0"
  // Not sure how we will want to extend this in future - should a step have access to all previous step outputs? Or can a single step have multiple outputs?
  return {
    ...workflow,
    params: {
      ...workflow.params,
      // TODO: Add validation to prevent user inputting 0 (or numbers generally) as param names
      "0": previousStepOutput.toString(),
    },
  };
};

// Run each step in sequence. The output of each step may be used as input to the next.
const runSteps = async (taskName: string, workflow: ExecutableWorkflow) => {
  let previousStepOutput: StepOutput = "";
  const task = workflow.tasks[taskName];
  const steps = task?.steps || [];

  for (const [index, step] of steps.entries()) {
    // Each step function will use this to parse its inputs
    // We could make this more generic by applying it to all entries in the step object before calling the functions (recursively to handle nested objects), then step functions would not need to know about interpolation at all.
    const interpolateWithStepContext = async (input: string | number) => {
      return await interpolateTaskString(
        input.toString(),
        workflowWithStepParams(workflow, previousStepOutput)
      );
    };

    // TODO: This long conditional is a bit hard to read. Needs to be tidied up somehow.
    if (isWaitStep(step)) {
      await wait(step.wait);
    } else if (isLengthStep(step)) {
      previousStepOutput = await length(
        step.length,
        interpolateWithStepContext
      );
    } else if (isGreaterThanStep(step)) {
      previousStepOutput = await greaterThan(
        step.gt,
        interpolateWithStepContext
      );
    } else if (isIfStep(step)) {
      previousStepOutput = await ifCondition(
        step.if,
        interpolateWithStepContext
      );
    } else {
      throw new Error(`Unknown step type: ${JSON.stringify(step)}`);
    }

    if (workflow.handleResult) {
      workflow.handleResult({
        task: taskName,
        step: index,
        result: previousStepOutput,
      });
    }
  }

  return previousStepOutput.toString();
};

export default runSteps;
