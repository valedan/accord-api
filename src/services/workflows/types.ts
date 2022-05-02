interface WaitStep {
  wait: number;
}

interface LengthStep {
  length: string;
}

interface GreaterThanStep {
  gt: [string, number];
}

interface IfStep {
  if: {
    condition: string;
    true: string;
    false: string;
  };
}

type Step = WaitStep | LengthStep | GreaterThanStep | IfStep;

interface Task {
  output?: string;
  steps?: Step[];
}

interface TaskCollection {
  [key: string]: Task;
}

interface WorkflowParams {
  [key: string]: string;
}

interface Workflow {
  entry_point: string;
  tasks: TaskCollection;
}

function isWaitStep(step: Step): step is WaitStep {
  return Object.prototype.hasOwnProperty.call(step, "wait");
}

function isLengthStep(step: Step): step is LengthStep {
  return Object.prototype.hasOwnProperty.call(step, "length");
}

function isGreaterThanStep(step: Step): step is GreaterThanStep {
  return Object.prototype.hasOwnProperty.call(step, "gt");
}

function isIfStep(step: Step): step is IfStep {
  return Object.prototype.hasOwnProperty.call(step, "if");
}

export { Step, Task, TaskCollection, Workflow, WorkflowParams, isWaitStep, isLengthStep, isGreaterThanStep, isIfStep };
