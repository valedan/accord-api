import runWorkflow from "./runWorkflow";

describe("runWorkflow", () => {
  describe("simple workflows", () => {
    it("runs a simple workflow and returns the output", async () => {
      const workflow = {
        entry_point: "hello_world",
        tasks: {
          hello_world: {
            output: "hello world!",
          },
        },
      };

      const output = await runWorkflow(workflow);

      expect(output).toBe("hello world!");
    });

    it("throws an error if the entry point task does not exist", async () => {
      const workflow = {
        entry_point: "missing",
        tasks: {
          hello_world: {
            output: "hello world!",
          },
        },
      };

      await expect(runWorkflow(workflow)).rejects.toThrow();
    });
  });

  describe("workflows with subtasks", () => {
    it("runs a workflow with a subtask and returns the output", async () => {
      const workflow = {
        entry_point: "hello_name",
        tasks: {
          name: {
            output: "Alan",
          },
          hello_name: {
            output: "hello ${name}!",
          },
        },
      };

      const output = await runWorkflow(workflow);

      expect(output).toBe("hello Alan!");
    });

    it("runs a workflow with multiple subtasks and returns the output", async () => {
      const workflow = {
        entry_point: "hello_names",
        tasks: {
          name: {
            output: "Alan",
          },
          other_name: {
            output: "Bob",
          },
          hello_names: {
            output: "hello ${name} and ${other_name}!",
          },
        },
      };

      const output = await runWorkflow(workflow);

      expect(output).toBe("hello Alan and Bob!");
    });

    it("runs a workflow with nested subtasks and returns the output", async () => {
      const workflow = {
        entry_point: "hello_name",
        tasks: {
          name: {
            output: "Alan",
          },
          other_name: {
            output: "Bob",
          },
          my_name: {
            output: "${other_name}",
          },
          hello_name: {
            output: "hello ${name}, my name is ${my_name}!",
          },
        },
      };

      const output = await runWorkflow(workflow);

      expect(output).toBe("hello Alan, my name is Bob!");
    });

    it("throws an error if subtask name it not found", async () => {
      const workflow = {
        entry_point: "hello_name",
        tasks: {
          hello_name: {
            output: "hello ${name}!",
          },
        },
      };

      await expect(runWorkflow(workflow)).rejects.toThrow();
    });

    it("throws an error if there is a cyclic dependency", async () => {
      const workflow = {
        entry_point: "hello_name",
        tasks: {
          name: {
            output: "${hello_name}",
          },

          hello_name: {
            output: "hello ${name}!",
          },
        },
      };

      await expect(runWorkflow(workflow)).rejects.toThrow();
    });
  });

  describe("workflows with parameters", () => {
    it("runs a workflow with a parameter and returns the output", async () => {
      const workflow = {
        entry_point: "hello_input",
        tasks: {
          hello_input: {
            output: "hello @{name}!",
          },
        },
      };

      const output = await runWorkflow(workflow, { name: "Alonzo" });

      expect(output).toBe("hello Alonzo!");
    });

    it("runs a workflow with multiple parameters and returns the output", async () => {
      const workflow = {
        entry_point: "hello_input",
        tasks: {
          hello_input: {
            output: "hello @{name} and @{other_name}!",
          },
        },
      };

      const output = await runWorkflow(workflow, { name: "Alan", other_name: "Bob" });

      expect(output).toBe("hello Alan and Bob!");
    });

    it("throws an error if parameter name it not found", async () => {
      const workflow = {
        entry_point: "hello_input",
        tasks: {
          hello_input: {
            output: "hello @{name}!",
          },
        },
      };

      await expect(runWorkflow(workflow)).rejects.toThrow();
    });
  });
});
