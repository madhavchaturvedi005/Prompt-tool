// Test function to verify OpenAI evaluation is working
import { evaluatePrompt } from './challengeEvaluator';

export async function testChallengeEvaluation() {
  const testPrompt = `You are a professional email assistant. Help users write clear, professional emails from bullet points.

Instructions:
1. Read the bullet points provided
2. Create a well-structured email with proper greeting and closing
3. Maintain professional tone throughout
4. Include all important information from the bullet points

Format your response as a complete email ready to send.`;

  const testCriteria = [
    { name: "Clarity", weight: 30, description: "Instructions are clear and easy to understand" },
    { name: "Completeness", weight: 25, description: "Covers all necessary aspects" },
    { name: "Structure", weight: 25, description: "Well organized and logical flow" },
    { name: "Professionalism", weight: 20, description: "Maintains appropriate tone" }
  ];

  try {
    console.log('Testing OpenAI evaluation...');
    const result = await evaluatePrompt(testPrompt, 'test-1', testCriteria);
    console.log('Evaluation successful:', result);
    return result;
  } catch (error) {
    console.error('Evaluation test failed:', error);
    return null;
  }
}