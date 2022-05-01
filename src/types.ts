interface Task {
  output: string;
}

interface Workflow {
  entry_point: string;
  tasks: {
    [key: string]: Task;
  };
}

export { Task, Workflow };
