import { WorkflowParams } from "../../../types";
import interpolateParams from "../../interpolateParams";

const greaterThan = (
  [input, threshold]: [string, number],
  params: WorkflowParams
) => {
  const interpolatedInput = interpolateParams(input, params);

  const numericInput = Number(interpolatedInput);

  // TODO: This is tricky - need some unit tests here!
  if (!Number.isFinite(numericInput)) {
    throw new Error(`Could not convert ${interpolatedInput} to a number`);
  }

  return numericInput > threshold;
};

export default greaterThan;
