interface Task {
  output: string;
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

export { Task, TaskCollection, Workflow, WorkflowParams };
