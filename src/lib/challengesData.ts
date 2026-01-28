// Import challenges data
import challengesSchema from "../../challenges-schema.json";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  points: number;
  participants: number;
  tags: string[];
  featured: boolean;
  objectives: string[];
  requirements: {
    inputFormat: string;
    outputFormat: string;
    constraints: string[];
  };
  testCases: Array<{
    input: string;
    expectedElements: string[];
  }>;
  evaluation: {
    criteria: Array<{
      name: string;
      weight: number;
      description: string;
    }>;
  };
  hints: string[];
  sampleSolution: {
    prompt: string;
    explanation: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  pointRange: [number, number];
  timeRange: string;
}

export const challenges: Challenge[] = challengesSchema.challenges as Challenge[];
export const categories: ChallengeCategory[] = challengesSchema.categories;
export const difficultyLevels: DifficultyLevel[] = challengesSchema.difficultyLevels as DifficultyLevel[];

// Helper functions
export const getChallengesByCategory = (categoryId: string): Challenge[] => {
  return challenges.filter(challenge => challenge.category === categoryId);
};

export const getChallengesByDifficulty = (difficulty: string): Challenge[] => {
  return challenges.filter(challenge => challenge.difficulty === difficulty);
};

export const getFeaturedChallenges = (): Challenge[] => {
  return challenges.filter(challenge => challenge.featured);
};

export const getWeeklyChallenges = (limit: number = 4): Challenge[] => {
  return challenges.slice(0, limit);
};