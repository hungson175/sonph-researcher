import { ChatOpenAI } from "@langchain/openai";
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

const LLM_MODEL_NAME = process.env.LLM_MODEL_NAME || "gpt-4o-mini";

export async function summarizeGitHubRepo(url) {
  try {
    // Validate URL
    if (!url || !url.startsWith('https://github.com/')) {
      throw new Error('Invalid GitHub URL');
    }

    // Initialize OpenAI model with the environment variable
    const model = new ChatOpenAI({ 
      modelName: LLM_MODEL_NAME,
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

    // Define the output schema
    const outputSchema = z.object({
      summary: z.string().describe("A concise summary of the GitHub repository"),
      outlines: z.array(z.string()).describe("A list of key points or sections from the repository"),
    });

    // Create the parser
    const parser = StructuredOutputParser.fromZodSchema(outputSchema);

    // Create a prompt template
    const prompt = new PromptTemplate({
      template: "Summarize the following GitHub repository content:\n\n{content}\n\nProvide a concise summary and a list of key points or sections.\n\n{format_instructions}",
      inputVariables: ["content"],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    // Create a chain
    const chain = RunnableSequence.from([prompt, model, parser]);

    // Run the chain
    const result = await chain.invoke({
      content: splits.map(doc => doc.pageContent).join("\n\n"),
    });

    return result;
  } catch (error) {
    console.error('Error in summarizeGitHubRepo:', error);
    throw error; // or return a specific error object
  }
}