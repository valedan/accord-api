import fastify from "fastify";

import workflowRoutes from "./api/workflows";

const buildApp = (opts = {}) => {
  const app = fastify(opts);

  app.register(workflowRoutes);

  return app;
};

export default buildApp;
