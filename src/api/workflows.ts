import { FastifyInstance } from "fastify";

const workflowRoutes = async (app: FastifyInstance) => {
  app.get("/ping", async () => {
    return { message: "pong" };
  });
};

export default workflowRoutes;
