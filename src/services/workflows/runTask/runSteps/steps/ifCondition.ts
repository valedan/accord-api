import { WorkflowParams } from "../../../types";
import interpolateParams from "../../interpolateParams";

interface Condition {
  condition: string;
  true: string;
  false: string;
}

const ifCondition = ({ condition, true: ifTrue, false: ifFalse }: Condition, params: WorkflowParams) => {
  const interpolatedInput = interpolateParams(condition, params);

  // TODO: Add interpolation for ifTrue and ifFalse
  return interpolatedInput === "true" ? ifTrue : ifFalse;
};

export default ifCondition;
