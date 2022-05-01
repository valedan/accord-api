import runWorkflow from "./runWorkflow";

describe("runWorkflow", () => {
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
