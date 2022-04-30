import build from "../app";

describe("ping", () => {
  it("pongs", async () => {
    const app = build();

    const response = await app.inject({
      method: "GET",
      url: "/ping",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("pong\n");
  });
});
