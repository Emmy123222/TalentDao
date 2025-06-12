const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export async function generateAITags(bio: string, category: string): Promise<string[]> {
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not found');
    return [];
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'TalentLink DAO'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes creator profiles and generates relevant tags. Based on the bio and category, generate 3-5 relevant tags that describe the person's skills, interests, or specializations. Return only a JSON array of strings, no additional text.`
          },
          {
            role: 'user',
            content: `Category: ${category}\nBio: ${bio}\n\nGenerate relevant tags for this creator profile.`
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        const tags = JSON.parse(content);
        return Array.isArray(tags) ? tags : [];
      } catch {
        // Fallback: extract tags from text response
        return content.split(',').map((tag: string) => tag.trim().replace(/['"]/g, '')).slice(0, 5);
      }
    }
    
    return [];
  } catch (error) {
    console.error('AI tagging error:', error);
    return [];
  }
}

export async function matchOpportunities(profile: any, opportunities: any[]): Promise<any[]> {
  if (!OPENROUTER_API_KEY || opportunities.length === 0) {
    return [];
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'TalentLink DAO'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI that matches creators to opportunities. Analyze the creator profile and available opportunities, then return a JSON array of opportunity IDs that best match the creator's skills and interests, sorted by relevance.`
          },
          {
            role: 'user',
            content: `Creator Profile:
Category: ${profile.category}
Bio: ${profile.bio}
Skills: ${profile.skills?.join(', ')}
AI Tags: ${profile.ai_tags?.join(', ')}

Available Opportunities:
${opportunities.map(opp => `ID: ${opp.id}, Title: ${opp.title}, Category: ${opp.category}, Tags: ${opp.tags?.join(', ')}`).join('\n')}

Return only a JSON array of opportunity IDs that match this creator, ordered by relevance.`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        const matchedIds = JSON.parse(content);
        return opportunities.filter(opp => matchedIds.includes(opp.id));
      } catch {
        return [];
      }
    }
    
    return [];
  } catch (error) {
    console.error('Opportunity matching error:', error);
    return [];
  }
}