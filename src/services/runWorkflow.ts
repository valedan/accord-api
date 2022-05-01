import { Task, TaskCollection, Workflow } from "../types";

const matchers = {
  // Captures all substrings enclosed by ${}
  subtasks: /\$\{([^}]+)\}/g,
};

// Subtasks are handled recursively by calling runTaskFromList again
const interpolateSubtasks = async (output: string, subtasks: TaskCollection) => {
  // For each match, the first element is the full match (eg ${name}), the second is the captured group (eg name)
  const subtaskMatches = Array.from(output.matchAll(matchers.subtasks));

  const subtaskOutputs = await Promise.all(subtaskMatches.map((match) => runTaskFromList(match[1], subtasks)));

  let newOutput = output;

  subtaskMatches.forEach((match, index) => {
    newOutput = newOutput.replace(match[0], subtaskOutputs[index]);
  });

  return newOutput;
};

const runTask = async (task: Task, otherTasks: TaskCollection) => {
  const outputWithSubtasks = await interpolateSubtasks(task.output, otherTasks);

  return outputWithSubtasks;
};

const runTaskFromList = async (taskName: string, tasks: TaskCollection) => {
  const task = tasks[taskName];

  if (!task) {
    throw new Error(`Could not find task ${taskName}`);
  }

  // It's important to filter out the current task to prevent infinite recursion
  const otherTasks = Object.fromEntries(Object.entries(tasks).filter(([name]) => name !== taskName));

  return runTask(task, otherTasks);
};

const runWorkflow = async (workflow: Workflow) => {
  const output = await runTaskFromList(workflow.entry_point, workflow.tasks);

  return output;
};

export default runWorkflow;
