import fastify from 'fastify';

const app = fastify();

app.addHook('onRequest', (request, reply, done) => {
  const origin = request.headers.origin;
  if (origin && origin.includes('localhost')) {
    reply.header('Access-Control-Allow-Origin', origin);
  }
  done();
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get<{ Params: { id: string } }>(
  '/api/v1/problem/:id/submit',
  (req, res) => {
    console.log('Problem ID:', req.params.id);
    res.send({ message: 'Hello World' });
  }
);

// Start the server
const start = async () => {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  try {
    await app.listen({ port });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
