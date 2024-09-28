import { OpenAI } from '@langchain/openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadSummarizationChain } from 'langchain/chains';

export async function summarizeGitHubRepo(url) {
  const model = new OpenAI({ 
    modelName: "gpt-4",
    temperature: 0 
  });

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const content = $('article.markdown-body').text();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.createDocuments([content]);

  const chain = loadSummarizationChain(model, { type: 'map_reduce' });
  const result = await chain.call({
    input_documents: splits,
  });

  return result.text;
}