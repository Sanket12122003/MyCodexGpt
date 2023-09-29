import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { OpenAI } from 'openai';
import { AbortController } from 'abort-controller'; // Import AbortController
import AbortControllerPolyfill from 'abort-controller/polyfill.js';



dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// Assign the polyfill to AbortController before creating an instance
AbortController.abortController = AbortControllerPolyfill;

// Now you can use AbortController as intended
const controller = new AbortController();

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // Check if response and response.data are defined
    if (response && response.choices && response.choices.length > 0) {
      const choices = response.choices;
      res.status(200).send({
        bot: choices[0].text,
      });
    } else {
      console.error('No choices in the response');
      res.status(500).send('No choices in the response');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error.message || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
