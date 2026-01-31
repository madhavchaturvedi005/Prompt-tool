// Practice Challenge Generator and Grading System

export interface GeneratedChallenge {
  title: string;
  scenario: string;
  task: string;
  constraints: string[];
  hidden_test_input: string;
  success_criteria: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export interface GradingResult {
  score: number;
  feedback: string;
  passed: boolean;
  workerOutput?: string;
  improvements?: string[];
  strengths?: string[];
}

const CATEGORIES = ['Coding', 'Creative Writing', 'Data Extraction', 'Chatbot Persona', 'Logical Reasoning'];

const GENERATOR_SYSTEM_PROMPT = `You are a "Prompt Engineering Challenge Architect." Your task is to generate a unique, high-quality prompt engineering task.

You will receive:
- Difficulty: Easy/Medium/Hard
- Category: One of [Coding, Creative Writing, Data Extraction, Chatbot Persona, Logical Reasoning]

You must return ONLY valid JSON with this exact structure (NO markdown, NO code blocks, JUST the JSON):
{
  "title": "A catchy name for the challenge",
  "scenario": "A 2-3 sentence background story",
  "task": "Exactly what the user needs to write a prompt for",
  "constraints": ["Rule 1", "Rule 2", "Rule 3"],
  "hidden_test_input": "A specific string that the user's prompt will be tested against",
  "success_criteria": "A brief explanation of what the Judge should look for"
}

Difficulty Guidelines:
- Easy: Simple persona adoption or formatting (e.g., "Act as a helpful assistant and explain X")
- Medium: Handling simple logic or specific tone constraints (e.g., "Explain in exactly 3 sentences using only simple words")
- Hard: Complex reasoning, negative constraints (avoiding words), or adversarial inputs (e.g., "Extract data without using any technical terms")

Constraint Examples:
- "Do not use the word 'AI' or 'artificial intelligence'"
- "Response must be under 50 words"
- "Use only questions, no statements"
- "Maintain a professional tone throughout"
- "Include exactly 3 examples"

CRITICAL: Return ONLY the raw JSON object. Do NOT wrap it in markdown code blocks. Do NOT add any explanatory text.`;

const JUDGE_SYSTEM_PROMPT = `You are a "Senior Prompt Engineer" grading a student's work.

You will receive:
- The Goal: What the task was
- The Constraints: Rules that must be followed
- The Result: The actual output from running the student's prompt

Your Task: Grade this out of 100 and provide detailed, actionable feedback.

Grading Rules:
- Deduct 20 points for EVERY constraint violated
- Deduct 10 points if the tone is incorrect
- Deduct 10 points if the output doesn't address the task
- Award full points only if the output perfectly matches the Success Criteria

Return ONLY valid JSON (NO markdown, NO code blocks, JUST the JSON):
{
  "score": number (0-100),
  "feedback": "A brief 1-2 sentence overall assessment",
  "passed": boolean (true if score >= 70),
  "strengths": ["What the prompt did well", "Another strength"],
  "improvements": ["Specific actionable suggestion 1", "Specific actionable suggestion 2", "Specific actionable suggestion 3"]
}

Guidelines for improvements:
- Be specific and actionable (e.g., "Add explicit instruction to limit response to 50 words" not "Be more concise")
- Focus on constraint violations first
- Suggest prompt engineering techniques (e.g., "Use role-playing: 'You are a...'", "Add output format specification", "Include examples")
- If score is perfect, still suggest 1-2 advanced techniques to try

CRITICAL: Return ONLY the raw JSON object. Do NOT wrap it in markdown code blocks. Do NOT add any explanatory text.`;

export async function generateChallenge(
  difficulty: 'Easy' | 'Medium' | 'Hard',
  apiKey: string
): Promise<GeneratedChallenge> {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: GENERATOR_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Generate a ${difficulty} difficulty challenge for the ${category} category.`,
        },
      ],
      temperature: 0.9, // High temperature for diversity
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate challenge');
  }

  const data = await response.json();
  let content = data.choices[0].message.content;

  // Strip markdown code blocks if present
  content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // Parse JSON response
  let challenge;
  try {
    challenge = JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse challenge JSON:', content);
    throw new Error('Invalid JSON response from challenge generator');
  }

  return {
    ...challenge,
    difficulty,
    category,
  };
}

export async function executeUserPrompt(
  userPrompt: string,
  hiddenTestInput: string,
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: userPrompt,
        },
        {
          role: 'user',
          content: hiddenTestInput,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to execute user prompt');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function gradeResult(
  task: string,
  constraints: string[],
  successCriteria: string,
  workerOutput: string,
  apiKey: string
): Promise<GradingResult> {
  const judgePrompt = `The Goal: ${task}

The Constraints:
${constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Success Criteria: ${successCriteria}

The Result to Evaluate:
"""
${workerOutput}
"""

Grade this output according to the rules.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: JUDGE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: judgePrompt,
        },
      ],
      temperature: 0, // Zero temperature for consistent grading
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to grade result');
  }

  const data = await response.json();
  let content = data.choices[0].message.content;

  // Strip markdown code blocks if present
  content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // Parse JSON response
  let result;
  try {
    result = JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse grading JSON:', content);
    throw new Error('Invalid JSON response from grading system');
  }

  return {
    ...result,
    workerOutput,
  };
}
