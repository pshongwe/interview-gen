import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENABLE_FALLBACK_QUESTIONS = (process.env.ENABLE_FALLBACK_QUESTIONS ?? 'true').toLowerCase() !== 'false';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main endpoint to generate interview questions
app.post('/api/questions', async (req, res) => {
  try {
    const { jobTitle } = req.body;

    // Validate input
    if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim() === '') {
      return res.status(400).json({
        error: 'jobTitle is required and must be a non-empty string'
      });
    }

    const cleanJobTitle = jobTitle.trim();

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const prompt = `Generate exactly 3 thoughtful interview questions for a candidate applying for the role of: ${cleanJobTitle}. The questions should be specific to the role, practical, and useful for assessing real job competence. Return only a numbered list.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the response into an array of questions
    const questions = parseQuestions(text);

    if (questions.length === 0) {
      return res.status(500).json({
        error: 'Failed to parse questions from AI response'
      });
    }

    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);

    if (error.message?.includes('API key')) {
      return res.status(500).json({
        error: 'Server misconfiguration: API key not set'
      });
    }

    if (isQuotaOrRateLimitError(error)) {
      if (ENABLE_FALLBACK_QUESTIONS) {
        const fallbackQuestions = generateFallbackQuestions(req.body?.jobTitle || 'this role');
        return res.status(200).json({
          questions: fallbackQuestions,
          warning: 'AI quota is currently exceeded. Returned fallback questions.',
          source: 'fallback'
        });
      }

      return res.status(429).json({
        error: 'AI quota exceeded. Please retry later or add billing in Google AI Studio.'
      });
    }

    res.status(500).json({
      error: 'Failed to generate questions. Please try again.'
    });
  }
});

// Helper function to parse questions from AI response
function parseQuestions(text) {
  // Split by newlines and filter out empty lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Extract questions - look for lines starting with numbers (1., 2., 3., etc.)
  const questions = [];
  for (const line of lines) {
    const match = line.match(/^[\d]+\.\s+(.+)$/);
    if (match) {
      questions.push(match[1]);
    }
  }

  return questions;
}

function isQuotaOrRateLimitError(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('429') ||
    message.includes('too many requests') ||
    message.includes('quota') ||
    message.includes('rate limit')
  );
}

function generateFallbackQuestions(jobTitle) {
  const role = String(jobTitle || 'this role').trim() || 'this role';
  return [
    `What are the top responsibilities in a ${role} position, and how would you prioritize them in your first 90 days?`,
    `Tell me about a challenging project relevant to ${role} work and how you handled trade-offs, stakeholders, and deadlines.`,
    `How do you measure success in a ${role} role, and what metrics or signals would you track regularly?`
  ];
}

// Error handling for non-existent routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
