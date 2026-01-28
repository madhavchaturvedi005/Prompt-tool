export interface ParsedPrompt {
  id: number;
  title: string;
  description: string;
  prompt: string;
  category: string;
  contributor?: string;
  stars: number;
  uses: number;
  featured: boolean;
}

function getCategory(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  // Coding related keywords
  if (lowerTitle.includes('developer') || lowerTitle.includes('terminal') || 
      lowerTitle.includes('console') || lowerTitle.includes('code') || 
      lowerTitle.includes('programming') || lowerTitle.includes('sql') ||
      lowerTitle.includes('javascript') || lowerTitle.includes('python') ||
      lowerTitle.includes('regex') || lowerTitle.includes('tech') ||
      lowerTitle.includes('software') || lowerTitle.includes('web') ||
      lowerTitle.includes('cyber') || lowerTitle.includes('machine learning') ||
      lowerTitle.includes('it ') || lowerTitle.includes('ascii') ||
      lowerTitle.includes('excel') || lowerTitle.includes('ethereum')) {
    return 'coding';
  }
  
  // Writing related keywords
  if (lowerTitle.includes('translator') || lowerTitle.includes('writer') || 
      lowerTitle.includes('english') || lowerTitle.includes('language') ||
      lowerTitle.includes('grammar') || lowerTitle.includes('pronunciation') ||
      lowerTitle.includes('plagiarism') || lowerTitle.includes('storyteller') ||
      lowerTitle.includes('novelist') || lowerTitle.includes('poet') ||
      lowerTitle.includes('screenwriter') || lowerTitle.includes('journalist') ||
      lowerTitle.includes('essay') || lowerTitle.includes('proofreader') ||
      lowerTitle.includes('synonyms') || lowerTitle.includes('biblical') ||
      lowerTitle.includes('emoji') || lowerTitle.includes('morse') ||
      lowerTitle.includes('note-taking') || lowerTitle.includes('commit message')) {
    return 'writing';
  }
  
  // Business related keywords
  if (lowerTitle.includes('interviewer') || lowerTitle.includes('advertiser') || 
      lowerTitle.includes('salesperson') || lowerTitle.includes('accountant') ||
      lowerTitle.includes('recruiter') || lowerTitle.includes('career') ||
      lowerTitle.includes('business') || lowerTitle.includes('investment') ||
      lowerTitle.includes('financial') || lowerTitle.includes('startup') ||
      lowerTitle.includes('lawyer') || lowerTitle.includes('real estate') ||
      lowerTitle.includes('logistician') || lowerTitle.includes('domain name') ||
      lowerTitle.includes('personal shopper') || lowerTitle.includes('chef') ||
      lowerTitle.includes('doctor') || lowerTitle.includes('dentist') ||
      lowerTitle.includes('dietitian') || lowerTitle.includes('psychologist')) {
    return 'business';
  }
  
  // Creative related keywords
  if (lowerTitle.includes('character') || lowerTitle.includes('comedian') || 
      lowerTitle.includes('storyteller') || lowerTitle.includes('composer') ||
      lowerTitle.includes('debater') || lowerTitle.includes('movie') ||
      lowerTitle.includes('rapper') || lowerTitle.includes('motivational') ||
      lowerTitle.includes('magician') || lowerTitle.includes('artist') ||
      lowerTitle.includes('designer') || lowerTitle.includes('makeup') ||
      lowerTitle.includes('florist') || lowerTitle.includes('interior') ||
      lowerTitle.includes('svg') || lowerTitle.includes('midjourney') ||
      lowerTitle.includes('dream') || lowerTitle.includes('time travel') ||
      lowerTitle.includes('adventure') || lowerTitle.includes('football commentator')) {
    return 'creative';
  }
  
  // Analysis related keywords
  if (lowerTitle.includes('analyst') || lowerTitle.includes('statistician') || 
      lowerTitle.includes('data') || lowerTitle.includes('research') ||
      lowerTitle.includes('mathematician') || lowerTitle.includes('fallacy') ||
      lowerTitle.includes('scientific') || lowerTitle.includes('socrat')) {
    return 'analysis';
  }
  
  // Education related keywords
  if (lowerTitle.includes('teacher') || lowerTitle.includes('tutor') || 
      lowerTitle.includes('instructor') || lowerTitle.includes('educational') ||
      lowerTitle.includes('philosophy') || lowerTitle.includes('math') ||
      lowerTitle.includes('coach') || lowerTitle.includes('trainer') ||
      lowerTitle.includes('mentor') || lowerTitle.includes('academician') ||
      lowerTitle.includes('yogi') || lowerTitle.includes('travel guide')) {
    return 'education';
  }
  
  return 'creative'; // Default category
}

function generateRandomStats() {
  return {
    stars: Math.floor(Math.random() * 500) + 50,
    uses: Math.floor(Math.random() * 5000) + 100,
    featured: Math.random() > 0.9 // 10% chance of being featured (to limit trending prompts)
  };
}

export function parsePromptsFromMarkdown(markdownContent: string): ParsedPrompt[] {
  const prompts: ParsedPrompt[] = [];
  
  // Split by details sections
  const sections = markdownContent.split('<details>');
  
  sections.forEach((section, index) => {
    if (index === 0) return; // Skip the header section
    
    // Extract title from summary
    const summaryMatch = section.match(/<summary><strong>(.*?)<\/strong><\/summary>/);
    if (!summaryMatch) return;
    
    const title = summaryMatch[1];
    
    // Extract contributor
    const contributorMatch = section.match(/Contributed by \[@([^\]]+)\]/);
    const contributor = contributorMatch ? contributorMatch[1] : undefined;
    
    // Extract prompt from markdown code block
    const promptMatch = section.match(/```md\n([\s\S]*?)\n```/);
    if (!promptMatch) return;
    
    const prompt = promptMatch[1].trim();
    
    // Generate description from first sentence of prompt
    const description = prompt.split('.')[0] + (prompt.includes('.') ? '.' : '');
    
    // Get category
    const category = getCategory(title);
    
    // Generate random stats
    const stats = generateRandomStats();
    
    prompts.push({
      id: index,
      title,
      description: description.length > 100 ? description.substring(0, 97) + '...' : description,
      prompt,
      category,
      contributor,
      ...stats
    });
  });
  
  return prompts;
}

// For use in React components (client-side)
export async function fetchAndParsePrompts(): Promise<ParsedPrompt[]> {
  try {
    const response = await fetch('/PROMPTS.md');
    const content = await response.text();
    return parsePromptsFromMarkdown(content);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
}