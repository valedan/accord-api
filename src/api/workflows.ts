import { FastifyInstance } from "fastify";

import { runWorkflow } from "../services/";
import {
  TaskResult, Workflow, WorkflowParams
} from "../services/workflows/types";

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
            anyOf: [
              {
                required: ["output"],
              },
              {
                required: ["steps"],
              },
            ],
            properties: {
              output: {
                type: "string",
              },
            },
          },
        },
      },
    },
    parameters: {
      type: "object",
      additionalProperties: {
        type: "string",
      },
    },
  },
};

const workflowRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: { workflow: Workflow; parameters: WorkflowParams } }>(
    "/workflows",
    { schema: { body: workflowSchema } },
    async (request) => {
      const { workflow, parameters } = request.body;

      const debug: TaskResult[] = [];

      const handleResult = ({ task, step, result }: TaskResult) => {
        debug.push({ task, step, result });
      };

      const output = await runWorkflow(workflow, parameters, handleResult);

      return { output, debug };
    }
  );
};

export default workflowRoutes;
