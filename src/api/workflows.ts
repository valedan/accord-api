import { FastifyInstance } from "fastify";

import { runWorkflow } from "../services/";
import { Workflow } from "../types";

const workflowSchema = {
  type: "object",
  required: ["workflow"],
  properties: {
    workflow: {
      type: "object",
      required: ["entry_point", "tasks"],
      properties: {
        entry_point: {
          type: "string",
        },
        tasks: {
          type: "object",
          additionalProperties: {
            type: "object",
            required: ["output"],
            properties: {
              output: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

const workflowRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: { workflow: Workflow } }>("/workflows", { schema: { body: workflowSchema } }, async (request) => {
    const { workflow } = request.body;

    const output = await runWorkflow(workflow);

    return { output };
  });
};

export default workflowRoutes;
