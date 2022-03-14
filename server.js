const fastify = require("fastify")({
    logger: false
});

fastify.register(require('fastify-cors'), {
    origin: true
})
  
const db = require("./sqLiteDB.js");
const errMsg = "There was an error connecting to the server";

// Test the server with the base get function 
fastify.get("/", (request, reply) => {
    reply.send({"hello": "world"});
});
  
  // Return the chat messages from the database helper script - no auth
fastify.get("/questions", async (request, reply) => {
    console.log("questions get attempted");
    let data = {};
    data = await db.getQuestions();
    let status = data? 200: 400;
    console.log(status);
    reply.status(status).send(data);
});
  
  // Add new message (auth)
fastify.post("/questions", async (request, reply) => {
    console.log("questions post attempted");
    const success = await db.addQuestion(JSON.parse(request.body));
    const status = success? 200: 400;
    reply.status(status).send(data);
});
  
// Update text for an message (auth)
fastify.post("/answers", async (request, reply) => { 
    let data = {};
    const success = await db.addAnswer(JSON.parse(request.body)); 
    const status = success? 200: 400;
    reply.status(status).send(data);
});


fastify.get("/answers", async (request, reply) => {
    let data = {};
    console.log(request.query.id);
    data = await db.getAnswers(request.query.id);
    let status = data? 200: 400;
    console.log(status);
    reply.status(status).send(data);
});
  
  
// Run the server and report out to the logs
const start = async () => {
    try {
        await fastify.listen(4000, '127.0.0.1')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
  