const fastify = require("fastify")({
    // Set this to true for detailed logging:
    logger: false
  });
  
  fastify.register(require("fastify-formbody"));
  
  const db = require("./sqLiteDB.js");
  const errMsg = "There was an error connecting to the server";
  
  // OnRoute hook to list endpoints
  const routes = { endpoints: [] };
  fastify.addHook("onRoute", routeOptions => {
    routes.endpoints.push(routeOptions.method + " " + routeOptions.path);
  });
  
  // Just send some info at the home route
  fastify.get("/", (request, reply) => {
    reply.send({"hello": "world"});
  });
  
  // Return the chat messages from the database helper script - no auth
  fastify.get("/messages", async (request, reply) => {
    let data = {};
    data.chat = await db.getMessages();
    console.log(data.chat);
    if(!data.chat) data.error = errMsg;
    const status = data.error ? 400 : 200;
    reply.status(status).send(data);
  });
  
  // Add new message (auth)
  fastify.post("/message", async (request, reply) => {
    let data = {};
    const auth = authorized(request.headers.admin_key);
    if(!auth || !request.body || !request.body.message) data.success = false;
    else if(auth) data.success = await db.addMessage(request.body.message);
    const status = data.success ? 201 : auth ? 400 : 401;
    reply.status(status).send(data);
  });
  
  // Update text for an message (auth)
  fastify.put("/message", async (request, reply) => { 
    let data = {};
    const auth = authorized(request.headers.admin_key);
    if(!auth || !request.body || !request.body.id || !request.body.message) data.success = false;
    else data.success = await db.updateMessage(request.body.id, request.body.message); 
    const status = data.success ? 201 : auth ? 400 : 401;
    reply.status(status).send(data);
  });
  
  // Delete a message (auth)
  fastify.delete("/message", async (request, reply) => {
    let data = {};
    const auth = authorized(request.headers.admin_key);
    if(!auth || !request.query || !request.query.id) data.success = false;
    else data.success = await db.deleteMessage(request.query.id);
    const status = data.success ? 201 : auth ? 400 : 401;
    reply.status(status).send(data);
  });
  
  // Helper function to authenticate the user key
  const authorized = key => {
    if (
      !key ||
      key < 1 ||
      !process.env.ADMIN_KEY ||
      key !== process.env.ADMIN_KEY
    )
      return false;
    else return true;
  };
  
  // Run the server and report out to the logs
  fastify.listen(process.env.PORT, '0.0.0.0', function(err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
  });
  