import { NextResponse } from 'next/server';
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

    if (!url || !url.startsWith('https://github.com/')) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }

    const summary = await summarizeGitHubRepo(url);
    
    await incrementApiKeyUsage(keyData.id, keyData.usage);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json({ error: 'Failed to summarize GitHub repository' }, { status: 500 });
  }
}