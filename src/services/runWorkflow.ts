import { Step, Task, TaskCollection, Workflow, WorkflowParams } from "../types";

const matchers = {
  // Captures all substrings enclosed by ${}
  subtasks: /\$\{([^}]+)\}/g,
  // Captures all substrings enclosed by @{}
  params: /@\{([^}]+)\}/g,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runSteps = async (output: string, steps: Step[]) => {
  for (const step of steps) {
    // Currently the only supported step is `wait`, but there could be others in future
    if (step.wait) {
      await sleep(step.wait * 1000);
    }
  }
  return output;
};

// Subtasks are handled recursively by calling runTaskFromList again
const interpolateSubtasks = async (output: string, subtasks: TaskCollection, params: WorkflowParams) => {
  // For each match, the first element is the full match (eg ${name}), the second is the captured group (eg name)
  const subtaskMatches = Array.from(output.matchAll(matchers.subtasks));

  const subtaskOutputs = await Promise.all(subtaskMatches.map((match) => runTaskFromList(match[1], subtasks, params)));

  let newOutput = output;

  subtaskMatches.forEach((match, index) => {
    newOutput = newOutput.replace(match[0], subtaskOutputs[index]);
  });

  return newOutput;
};

const interpolateParams = async (output: string, params: WorkflowParams) => {
  const paramMatches = Array.from(output.matchAll(matchers.params));

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

const runTask = async (task: Task, otherTasks: TaskCollection, params: WorkflowParams) => {
  const outputAfterSteps = task.steps ? await runSteps(task.output, task.steps) : task.output;
  const outputWithSubtasks = await interpolateSubtasks(outputAfterSteps, otherTasks, params);
  const outputWithParams = await interpolateParams(outputWithSubtasks, params);
  return outputWithParams;
};

const runTaskFromList = async (taskName: string, tasks: TaskCollection, params: WorkflowParams) => {
  const task = tasks[taskName];

  if (!task) {
    throw new Error(`Could not find task ${taskName}`);
  }

  // It's important to filter out the current task to prevent infinite recursion
  const otherTasks = Object.fromEntries(Object.entries(tasks).filter(([name]) => name !== taskName));

  return runTask(task, otherTasks, params);
};

const runWorkflow = async (workflow: Workflow, params: WorkflowParams = {}) => {
  const output = await runTaskFromList(workflow.entry_point, workflow.tasks, params);

  return output;
};

export default runWorkflow;
