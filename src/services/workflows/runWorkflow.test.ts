import runWorkflow from "./runWorkflow";

jest.useFakeTimers();

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
        params: {},
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
        params: {},
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
        params: {},
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
        params: {},
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
        params: {},
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
        params: {},
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
        params: {},
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
        params: { name: "Alonzo" },
      };

      const output = await runWorkflow(workflow);

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
        params: {
          name: "Alan",
          other_name: "Bob",
        },
      };

      const output = await runWorkflow(workflow);

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
        params: {},
      };

      await expect(runWorkflow(workflow)).rejects.toThrow();
    });
  });

  // TODO: Fix this test - timers not working properly
  describe("workflows with steps", () => {
    it.skip("runs a workflow with a step and returns the output", async () => {
      const workflow = {
        entry_point: "slow_goodbye",
        tasks: {
          slow_goodbye: {
            steps: [
              {
                wait: 5,
              },
            ],
            output: "goodbye!",
          },
        },
        params: {},
      };

      const output = await runWorkflow(workflow);

      jest.advanceTimersByTime(5000);

      expect(output).toBe("goodbye!");
    });

    it("runs a workflow with conditions and returns the output", async () => {
      const workflow = {
        entry_point: "name_classifier",
        tasks: {
          name_is_long_or_short: {
            steps: [
              {
                length: "@{name}",
              },
              {
                gt: ["@{0}", 7] as [string, number],
              },
              {
                if: {
                  condition: "@{0}",
                  true: "long name",
                  false: "short name",
                },
              },
            ],
          },
          name_classifier: {
            output: "@{name} is a ${name_is_long_or_short}",
          },
        },
      };

      const shortOutput = await runWorkflow({
        ...workflow,
        params: { name: "Harold" },
      });

      const longOutput = await runWorkflow({
        ...workflow,
        params: { name: "Margaret" },
      });

      expect(shortOutput).toBe("Harold is a short name");
      expect(longOutput).toBe("Margaret is a long name");
    });

    it("interpolates subtasks and parameters in steps", async () => {
      const workflow = {
        entry_point: "custom_name_classifier",
        tasks: {
          is_name_greater_than_threshold: {
            steps: [
              {
                length: "@{name}",
              },
              {
                gt: ["@{0}", "@{threshold}"] as [string, string],
              },
            ],
          },
          name_is_long_or_short: {
            steps: [
              {
                if: {
                  condition: "${is_name_greater_than_threshold}",
                  true: "longer than @{threshold}",
                  false: "shorter than @{threshold}",
                },
              },
            ],
          },
          custom_name_classifier: {
            output: "@{name} is ${name_is_long_or_short}",
          },
        },
      };

      const shortOutput = await runWorkflow({
        ...workflow,
        params: {
          name: "Harold",
          threshold: "7",
        },
      });

      const longOutput = await runWorkflow({
        ...workflow,
        params: {
          name: "Margaret",
          threshold: "7",
        },
      });

      expect(shortOutput).toBe("Harold is shorter than 7");
      expect(longOutput).toBe("Margaret is longer than 7");
    });
  });
});
