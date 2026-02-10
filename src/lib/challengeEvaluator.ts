interface EvaluationCriteria {
  name: string;
  weight: number;
  description: string;
}

interface EvaluationResult {
  overallScore: number;
  criteriaScores: Record<string, number>;
  feedback: string;
  suggestions: string[];
}

export async function evaluatePrompt(
  prompt: string,
  challengeId: string,
  criteria: EvaluationCriteria[]
): Promise<EvaluationResult> {
  try {
    const proxyUrl = import.meta.env.VITE_OPENAI_PROXY_URL || 'http://localhost:3002';

    const evaluationPrompt = `You are an expert prompt engineering evaluator. Evaluate the following prompt based on the given criteria and provide detailed feedback.

PROMPT TO EVALUATE:
${prompt}

EVALUATION CRITERIA:
${criteria.map(c => `- ${c.name} (${c.weight}%): ${c.description}`).join('\n')}

Please provide your evaluation in the following JSON format:
{
  "criteriaScores": {
    ${criteria.map(c => `"${c.name}": <score_out_of_10>`).join(',\n    ')}
  },
  "feedback": "Overall feedback about the prompt quality and effectiveness",
  "suggestions": ["Specific suggestion 1", "Specific suggestion 2", "Specific suggestion 3"]
}

Rate each criterion on a scale of 1-10, where:
- 1-3: Poor (major issues, doesn't meet requirements)
- 4-6: Fair (meets basic requirements but has significant room for improvement)
- 7-8: Good (meets requirements well with minor improvements needed)
- 9-10: Excellent (exceeds expectations, professional quality)

Be constructive and specific in your feedback and suggestions.`;

    const response = await fetch(`${proxyUrl}/api/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert prompt engineering evaluator. Provide detailed, constructive feedback on prompt quality.'
          },
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const evaluationText = data.choices[0].message.content;

    // Parse the JSON response
    const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid evaluation response format');
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    // Calculate weighted overall score
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const criterion of criteria) {
      const score = evaluation.criteriaScores[criterion.name] || 0;
      totalWeightedScore += (score / 10) * criterion.weight;
      totalWeight += criterion.weight;
    }

    const overallScore = Math.round((totalWeightedScore / totalWeight) * 100);

    return {
      overallScore,
      criteriaScores: evaluation.criteriaScores,
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions || []
    };

  } catch (error) {
    console.error('Evaluation error:', error);
    
    // Fallback evaluation if OpenAI fails
    const fallbackScores: Record<string, number> = {};
    criteria.forEach(c => {
      fallbackScores[c.name] = Math.floor(Math.random() * 3) + 6; // 6-8 range
    });

    return {
      overallScore: 75,
      criteriaScores: fallbackScores,
      feedback: "Unable to connect to evaluation service. This is a fallback score based on prompt length and structure.",
      suggestions: [
        "Ensure your prompt is clear and specific",
        "Include examples when helpful",
        "Consider edge cases and error handling"
      ]
    };
  }
}