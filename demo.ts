import { AgentsmithClient } from '@agentsmith-app/sdk';
import type { Agency } from './agentsmith/agentsmith.types';
import dotenv from 'dotenv';

dotenv.config();

const client = new AgentsmithClient<Agency>(
  process.env.AGENTSMITH_API_KEY!,
  '0c26f1b2-70f3-43dc-915e-77800d800f44'
);

const prompt = await client.getPrompt('compare-input-output@0.0.1');
const { content } = await prompt.execute({
  input: '1+1',
  output: '2',
});

console.log(content);

await client.shutdown();
