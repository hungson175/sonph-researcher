import { NextResponse } from 'next/server';
import { summarizeGitHubRepo } from './githubSummarizer';
import { validateApiKey, incrementApiKeyUsage } from './apiKeyManager';
import { summarizeGitHubRepo } from './githubSummarizer';
import { validateApiKey, incrementApiKeyUsage } from './apiKeyManager';

export async function POST(req) {
  try {
    const apiKey = req.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    const keyData = await validateApiKey(apiKey);
    if (!keyData) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { url } = await req.json();

    const result = await summarizeGitHubRepo(url);

    // Increment the usage count after successful summarization
    await incrementApiKeyUsage(keyData.id, keyData.usage);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json({ error: error.message || 'Failed to summarize GitHub repository' }, { status: 500 });
  }
}