import {
  isGreaterThanStep, isIfStep, isLengthStep, isWaitStep, Step, TaskResult,
  WorkflowParams
} from "../../types";
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
    // Converting to string is unfortunate here and adds complexity to some steps such as greaterThan and if.
    // But it lets us treat interpolation in a consistent way for all task inputs
    // Worth thinking about this more - there is probably a better way
    "0": previousStepOutput.toString(),
  };
};

const runSteps = async (
  steps: Step[] = [],
  params: WorkflowParams,
  taskName: string,
  handleResult?: (result: TaskResult) => void
) => {
  // Run each step in sequence. The output of each step may be used as input to the next.

  let previousStepOutput: StepOutput = "";

  for (const [index, step] of steps.entries()) {
    const stepParams = paramsForStep(params, previousStepOutput);

    if (isWaitStep(step)) {
      await wait(step.wait); // Wait does not modify the previous output
    } else if (isLengthStep(step)) {
      previousStepOutput = length(step.length, stepParams);
    } else if (isGreaterThanStep(step)) {
      previousStepOutput = greaterThan(step.gt, stepParams);
    } else if (isIfStep(step)) {
      previousStepOutput = ifCondition(step.if, stepParams);
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
