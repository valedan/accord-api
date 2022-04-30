import fastify from "fastify";

import cors from "@fastify/cors";

import workflowRoutes from "./api/workflows";

const buildApp = (opts = {}) => {
  const app = fastify(opts);

  app.register(cors, {
    origin: "*",
  });

  app.register(workflowRoutes);

  return app;
};

export default buildApp;
