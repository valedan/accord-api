import executeWorkflow from "./executeWorkflow";

describe("executeWorkflow", () => {
  it("executes a simple workflow and returns the output", async () => {
    const workflow = {
      entry_point: "hello_world",
      tasks: {
        hello_world: {
          output: "hello world!",
        },
      },
    };

    const output = await executeWorkflow(workflow);

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

    await expect(executeWorkflow(workflow)).rejects.toThrow();
  });
});
