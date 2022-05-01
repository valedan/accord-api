interface Task {
  output: string;
}

interface TaskCollection {
  [key: string]: Task;
}

interface Workflow {
  entry_point: string;
  tasks: TaskCollection;
}

export { Task, TaskCollection, Workflow };
