import {
  isGreaterThanStep, isIfStep, isLengthStep, isWaitStep, Step, TaskCollection,
  TaskResult, WorkflowParams
} from "../../types";
import { interpolateTaskString } from "../interpolate";
import { greaterThan, ifCondition, length, wait } from "./steps";

// Eventually we may need to handle steps that output arrays or objects, but for now all of our steps are simple.
type StepOutput = string | number | boolean;

const paramsForStep = (
  workflowParams: WorkflowParams,
  previousStepOutput: StepOutput
) => {
  return {
    ...workflowParams,
    // TODO: Add validation to prevent user inputting 0 (or numbers generally) as param names
    "0": previousStepOutput.toString(),
  };
};

// Run each step in sequence. The output of each step may be used as input to the next.
const runSteps = async (
  steps: Step[] = [],
  otherTasks: TaskCollection,
  params: WorkflowParams,
  taskName: string,
  handleResult?: (result: TaskResult) => void
) => {
  let previousStepOutput: StepOutput = "";

  for (const [index, step] of steps.entries()) {
    const stepParams = paramsForStep(params, previousStepOutput);

    // Each step function will use this to parse its inputs
    // We could make this more generic by applying it to all entries in the step object before calling the functions (recursively to handle nested objects), then step functions would not need to know about interpolation at all.
    const interpolateWithStepContext = async (input: string | number) => {
      return await interpolateTaskString(
        input.toString(),
        otherTasks,
        stepParams,
        handleResult
      );
    };

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

    if (handleResult) {
      handleResult({
        task: taskName,
        step: index,
        result: previousStepOutput,
      });
    }
  }

  return previousStepOutput.toString();
};

export default runSteps;
