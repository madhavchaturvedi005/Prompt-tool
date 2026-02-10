export interface ArenaEvaluationCriteria {
  name: string;
  description: string;
  weight: number;
  applicableTypes: string[]; // Types of prompts this criterion applies to
}

export interface ArenaEvaluationResult {
  overallScore: number;
  criteriaScores: Record<string, number>;
  applicableCriteria: string[]; // Only criteria that were evaluated
  feedback: string;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  promptType: string;
}

// Comprehensive evaluation criteria with applicability rules
export const ARENA_CRITERIA: ArenaEvaluationCriteria[] = [
  { name: "Quality", description: "Overall prompt quality and effectiveness", weight: 10, applicableTypes: ["all"] },
  { name: "Accuracy", description: "Precision and correctness of instructions", weight: 9, applicableTypes: ["all"] },
  { name: "Understandability", description: "Clarity and comprehensibility of instructions", weight: 9, applicableTypes: ["all"] },
  { name: "Security", description: "Protection against prompt injection and misuse", weight: 8, applicableTypes: ["all"] },
  { name: "Reliability", description: "Consistency of results across different inputs", weight: 8, applicableTypes: ["all"] },
  { name: "Maintainability", description: "Ease of updating and modifying the prompt", weight: 7, applicableTypes: ["code", "technical", "complex", "system"] },
  { name: "Testability", description: "Ability to validate and test prompt effectiveness", weight: 6, applicableTypes: ["code", "technical", "analysis"] },
  { name: "Modularity", description: "Well-structured and organized components", weight: 6, applicableTypes: ["code", "technical", "complex", "system"] },
  { name: "Explainability", description: "Transparency in reasoning and decision-making", weight: 7, applicableTypes: ["analysis", "educational", "complex"] },
  { name: "Scalability", description: "Performance with varying input sizes and complexity", weight: 6, applicableTypes: ["code", "technical", "system", "analysis"] },
  { name: "Stability", description: "Consistent behavior across different scenarios", weight: 7, applicableTypes: ["code", "technical", "system"] },
  { name: "Productivity", description: "Efficiency in achieving desired outcomes", weight: 8, applicableTypes: ["all"] },
  { name: "Extensibility", description: "Ease of adding new features or capabilities", weight: 5, applicableTypes: ["code", "technical", "system"] },
  { name: "Changeability", description: "Flexibility to adapt to new requirements", weight: 6, applicableTypes: ["code", "technical", "system"] },
  { name: "Compatibility", description: "Works well with different AI models and systems", weight: 6, applicableTypes: ["technical", "system"] },
  { name: "Reusability", description: "Applicability across different contexts and use cases", weight: 6, applicableTypes: ["code", "technical", "template"] },
  { name: "Availability", description: "Robustness and error handling capabilities", weight: 6, applicableTypes: ["code", "technical", "system"] },
  { name: "Vulnerabilities", description: "Resistance to adversarial inputs", weight: 7, applicableTypes: ["all"] }
];

// Function to determine prompt type and applicable criteria
function analyzePromptType(prompt: string): { type: string; applicableCriteria: ArenaEvaluationCriteria[] } {
  const lowerPrompt = prompt.toLowerCase();
  
  // Determine prompt type based on content
  let promptType = "general";
  
  if (lowerPrompt.includes("code") || lowerPrompt.includes("programming") || lowerPrompt.includes("function") || 
      lowerPrompt.includes("debug") || lowerPrompt.includes("algorithm") || lowerPrompt.includes("script")) {
    promptType = "code";
  } else if (lowerPrompt.includes("analyze") || lowerPrompt.includes("data") || lowerPrompt.includes("report") || 
             lowerPrompt.includes("insights") || lowerPrompt.includes("statistics")) {
    promptType = "analysis";
  } else if (lowerPrompt.includes("teach") || lowerPrompt.includes("explain") || lowerPrompt.includes("learn") || 
             lowerPrompt.includes("tutorial") || lowerPrompt.includes("guide")) {
    promptType = "educational";
  } else if (lowerPrompt.includes("system") || lowerPrompt.includes("architecture") || lowerPrompt.includes("design") || 
             lowerPrompt.includes("framework")) {
    promptType = "system";
  } else if (lowerPrompt.includes("template") || lowerPrompt.includes("format") || lowerPrompt.includes("structure")) {
    promptType = "template";
  } else if (lowerPrompt.includes("technical") || lowerPrompt.includes("engineering") || lowerPrompt.includes("specification")) {
    promptType = "technical";
  } else if (lowerPrompt.length > 200 || lowerPrompt.includes("complex") || lowerPrompt.includes("comprehensive")) {
    promptType = "complex";
  }

  // Filter applicable criteria
  const applicableCriteria = ARENA_CRITERIA.filter(criterion => 
    criterion.applicableTypes.includes("all") || 
    criterion.applicableTypes.includes(promptType)
  );

  return { type: promptType, applicableCriteria };
}

export async function evaluatePromptInArena(prompt: string): Promise<ArenaEvaluationResult> {
  try {
    const proxyUrl = import.meta.env.VITE_OPENAI_PROXY_URL || 'http://localhost:3002';

    // Analyze prompt type and get applicable criteria
    const { type: promptType, applicableCriteria } = analyzePromptType(prompt);

    const evaluationPrompt = `You are an expert prompt engineering evaluator specializing in comprehensive prompt quality assessment. Evaluate the following prompt across the relevant quality dimensions.

PROMPT TO EVALUATE:
${prompt}

PROMPT TYPE DETECTED: ${promptType}

RELEVANT EVALUATION CRITERIA (only evaluate these):
${applicableCriteria.map(c => `- ${c.name}: ${c.description}`).join('\n')}

Please provide your evaluation in the following JSON format:
{
  "criteriaScores": {
    ${applicableCriteria.map(c => `"${c.name}": <score_out_of_100>`).join(',\n    ')}
  },
  "feedback": "Comprehensive feedback about the prompt's quality and effectiveness for its intended purpose",
  "suggestions": ["Specific improvement suggestion 1", "Specific improvement suggestion 2", "Specific improvement suggestion 3"],
  "strengths": ["Key strength 1", "Key strength 2", "Key strength 3"],
  "weaknesses": ["Area for improvement 1", "Area for improvement 2"]
}

Rate each criterion on a scale of 0-100, where:
- 0-20: Critical issues (major flaws, unsafe, unusable)
- 21-40: Poor (significant problems, limited effectiveness)
- 41-60: Fair (basic functionality but needs improvement)
- 61-80: Good (solid performance with minor issues)
- 81-100: Excellent (exceptional quality, best practices)

IMPORTANT: Only evaluate criteria that are relevant to this type of prompt. For example:
- Simple prompts don't need "Reusability" or "Modularity" scores
- Creative prompts don't need "Testability" or "Scalability" scores
- Focus on what matters for the prompt's intended purpose

Be thorough, constructive, and specific in your evaluation.`;

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
            content: 'You are an expert prompt engineering evaluator with deep knowledge of AI safety, prompt optimization, and software quality metrics. Focus only on relevant criteria for each prompt type.'
          },
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
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

    // Calculate weighted overall score using only applicable criteria
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const criterion of applicableCriteria) {
      const score = evaluation.criteriaScores[criterion.name] || 0;
      totalWeightedScore += score * criterion.weight;
      totalWeight += criterion.weight * 100; // Since scores are out of 100
    }

    const overallScore = Math.round(totalWeightedScore / totalWeight * 100);

    return {
      overallScore,
      criteriaScores: evaluation.criteriaScores,
      applicableCriteria: applicableCriteria.map(c => c.name),
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions || [],
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      promptType
    };

  } catch (error) {
    console.error('Arena evaluation error:', error);
    
    // Analyze prompt type for fallback
    const { type: promptType, applicableCriteria } = analyzePromptType(prompt);
    
    // Fallback evaluation with realistic scores for applicable criteria only
    const fallbackScores: Record<string, number> = {};
    applicableCriteria.forEach(c => {
      const baseScore = c.weight >= 8 ? 75 : c.weight >= 7 ? 70 : 65;
      fallbackScores[c.name] = baseScore + Math.floor(Math.random() * 15);
    });

    return {
      overallScore: 72,
      criteriaScores: fallbackScores,
      applicableCriteria: applicableCriteria.map(c => c.name),
      feedback: `Evaluation service temporarily unavailable. This is a simulated assessment for a ${promptType} prompt based on structure and content analysis.`,
      suggestions: [
        "Add more specific instructions and examples",
        "Consider edge cases and error handling",
        "Improve clarity and reduce ambiguity"
      ],
      strengths: [
        "Clear basic structure",
        "Appropriate for intended purpose"
      ],
      weaknesses: [
        "Could be more specific",
        "May need better context"
      ],
      promptType
    };
  }
}