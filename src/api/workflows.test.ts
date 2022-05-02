import build from "../app";

const app = build();

describe("POST /workflows", () => {
  it("returns a 400 if the workflow is invalid", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/workflows",
      payload: {
        workflow: {
          entry_point: "missing",
        },
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("runs a valid workflow and returns the output", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/workflows",
      payload: {
        workflow: {
          entry_point: "hello_world",
          tasks: {
            hello_world: {
              output: "hello world!",
            },
          },
        },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({ output: "hello world!" });
  });

  it("runs a workflow with parameters and returns the output", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/workflows",
      payload: {
        workflow: {
          entry_point: "hello_name",
          tasks: {
            hello_name: {
              output: "hello @{name}!",
            },
          },
        },
        parameters: {
          name: "Alonzo",
        },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({ output: "hello Alonzo!" });
  });
});
