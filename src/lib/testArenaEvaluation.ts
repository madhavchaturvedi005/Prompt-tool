// Test function to verify Arena evaluation is working
import { evaluatePromptInArena } from './arenaEvaluator';

export async function testArenaEvaluation() {
  const testPrompt = `You are a senior software engineer and code reviewer. Your task is to analyze code submissions and provide comprehensive feedback.

Instructions:
1. Review the provided code for bugs, security vulnerabilities, and performance issues
2. Check for adherence to best practices and coding standards
3. Provide specific, actionable feedback with examples
4. Rate the code quality on a scale of 1-10
5. Suggest improvements and optimizations

Guidelines:
- Be constructive and educational in your feedback
- Focus on both technical correctness and maintainability
- Consider security implications and edge cases
- Provide code examples for suggested improvements

Format your response with:
- Overall assessment
- Specific issues found
- Recommended improvements
- Code quality rating with justification`;

  try {
    console.log('Testing Arena evaluation with comprehensive prompt...');
    const result = await evaluatePromptInArena(testPrompt);
    console.log('Arena evaluation successful:', result);
    return result;
  } catch (error) {
    console.error('Arena evaluation test failed:', error);
    return null;
  }
}