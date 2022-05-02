import { WorkflowParams } from "../../../types";
import interpolateParams from "../../interpolateParams";

const length = (input: string, params: WorkflowParams) => {
  const interpolatedInput = interpolateParams(input, params);

  return interpolatedInput.length;
};

export default length;
