import { FastifyInstance } from "fastify";

const workflowRoutes = async (app: FastifyInstance) => {
  app.get("/ping", async (request, reply) => {
    return "pong\n";
  });
};

export default workflowRoutes;
