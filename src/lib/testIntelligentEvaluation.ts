// Test intelligent evaluation system
import { ARENA_CRITERIA } from './arenaEvaluator';

// Test function to show how criteria are filtered based on prompt type
export function testCriteriaFiltering() {
  const testPrompts = [
    {
      prompt: "Write a professional email to decline a meeting",
      expectedType: "general",
      expectedCriteria: ["Quality", "Accuracy", "Understandability", "Security", "Reliability", "Productivity", "Vulnerabilities"]
    },
    {
      prompt: "You are a code reviewer. Analyze this Python function for bugs and optimization opportunities",
      expectedType: "code", 
      expectedCriteria: ["Quality", "Accuracy", "Understandability", "Security", "Reliability", "Maintainability", "Testability", "Modularity", "Scalability", "Stability", "Productivity", "Extensibility", "Changeability", "Reusability", "Availability", "Vulnerabilities"]
    },
    {
      prompt: "Analyze this sales data and provide insights about customer behavior trends",
      expectedType: "analysis",
      expectedCriteria: ["Quality", "Accuracy", "Understandability", "Security", "Reliability", "Testability", "Explainability", "Scalability", "Productivity", "Vulnerabilities"]
    },
    {
      prompt: "You are a teacher. Explain quantum physics to a high school student", 
      expectedType: "educational",
      expectedCriteria: ["Quality", "Accuracy", "Understandability", "Security", "Reliability", "Explainability", "Productivity", "Vulnerabilities"]
    }
  ];

  console.log('Intelligent Criteria Filtering Test:');
  console.log('=====================================');
  
  testPrompts.forEach((test, i) => {
    console.log(`\n${i + 1}. Prompt: "${test.prompt}"`);
    console.log(`   Expected Type: ${test.expectedType}`);
    console.log(`   Expected Criteria Count: ${test.expectedCriteria.length}`);
    console.log(`   Criteria: ${test.expectedCriteria.join(', ')}`);
  });

  console.log(`\nTotal Available Criteria: ${ARENA_CRITERIA.length}`);
  console.log('Criteria Names:', ARENA_CRITERIA.map(c => c.name).join(', '));
}

// Run the test
if (typeof window === 'undefined') {
  testCriteriaFiltering();
}