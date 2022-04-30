import buildApp from "./app";

const server = buildApp({
  logger: {
    level: "info",
    prettyPrint: true,
  },
});

server.listen(4000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
