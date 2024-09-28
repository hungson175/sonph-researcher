import { NextResponse } from 'next/server';
import { OpenAI } from '@langchain/openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadSummarizationChain } from 'langchain/chains';
import { supabase } from '../../../lib/supabaseClient';

async function validateApiKey(apiKey) {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, usage')
    .eq('value', apiKey)
    .single();

  if (error) {
    console.error('Error querying API key:', error);
    return null;
  }
  
  return data; // Return the full data object if found, null otherwise
}

async function incrementApiKeyUsage(id, currentUsage) {
  const { error: updateError } = await supabase
    .from('api_keys')
    .update({ usage: currentUsage + 1 })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating API key usage:', updateError);
  }
}

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

    // Validate URL
    if (!url || !url.startsWith('https://github.com/')) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }

    // Initialize OpenAI model with GPT-4
    const model = new OpenAI({ 
      modelName: "gpt-4o",
      temperature: 0 
    });

    // Fetch and parse the GitHub page
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const content = $('article.markdown-body').text();

    // Split the text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.createDocuments([content]);

    // Create and run the summarization chain
    const chain = loadSummarizationChain(model, { type: 'map_reduce' });
    const result = await chain.call({
      input_documents: splits,
    });

    // Increment the usage count after successful summarization
    await incrementApiKeyUsage(keyData.id, keyData.usage);

    return NextResponse.json({ summary: result.text });
  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json({ error: 'Failed to summarize GitHub repository' }, { status: 500 });
  }
}