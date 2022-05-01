interface Step {
  wait: number;
}
interface Task {
  output: string;
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

export { Step, Task, TaskCollection, Workflow, WorkflowParams };
