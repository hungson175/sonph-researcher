import { NextResponse } from 'next/server';
import { OpenAI } from '@langchain/openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadSummarizationChain } from 'langchain/chains';

export async function POST(req) {
  try {
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

    return NextResponse.json({ summary: result.text });
  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json({ error: 'Failed to summarize GitHub repository' }, { status: 500 });
  }
}