import fastify from 'fastify';
import { AgentsmithClient } from '@agentsmith-app/sdk';
import type { Agency } from '../agentsmith/agentsmith.types';
import dotenv from 'dotenv';

dotenv.config();

const client = new AgentsmithClient<Agency>(
  process.env.AGENTSMITH_API_KEY!,
  '0c26f1b2-70f3-43dc-915e-77800d800f44'
);

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

app.post<{ Body: string; Params: { id: string } }>(
  '/api/v1/problem/:id/submit',
  async (req, res) => {
    const body = JSON.parse(req.body);
    const { input, output } = body;
    if (!input || !output) {
      return res.status(400).send({ error: 'Input and output are required' });
    }
    const prompt = await client.getPrompt('problem-give-only-json@0.0.1');
    const result = await prompt.execute({
      input,
      output,
    });
    res.send({ result });
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
