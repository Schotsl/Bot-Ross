import rules from "../rules.json";

import { stripHtml } from "string-strip-html";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  name: string;
  model: GenerativeModel;
  client: GoogleGenerativeAI;

  constructor() {
    this.name = process.env.GEMINI_API_MODEL!;
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.client.getGenerativeModel({ model: this.name });
  }

  async cleanEmail(html: string) {
    console.log(`🤖 Cleaning email using ${this.name}`);

    const responsePrompt = `You are tasked with cleaning up an email from unnecessary content and random junk, only leave the important parts of the email. The email is as follows:\n\n${html}`;
    const responseObject = await this.model.generateContent([responsePrompt]);
    const responseText = responseObject.response.text();

    return responseText;
  }

  async verifyEmail(subject: string, body: string) {
    console.log(`🤖 Verifying email using ${this.name}`);

    const requestRules = rules.join(",\n");
    const requestPrompt = `You are tasked with filtering emails based on their subject and content. You must return a JSON object with two properties. The first, 'ignore,' indicates whether the email should be ignored. The second, 'rule,' specifies the rule that led to ignoring the email, or null if the email should not be ignored. Do not return anything other than this JSON object! Consider the following rules when determining if an email should be ignored:\n${requestRules}\n\nSubject: ${subject}\n\nBody: ${body}`;

    const responseObject = await this.model.generateContent([requestPrompt]);

    // Turn the response with markdown into a JSON object
    let jsonPlain = responseObject.response.text();

    jsonPlain = jsonPlain.replace(/(\r\n|\n|\r)/gm, "");
    jsonPlain = jsonPlain.trim();
    jsonPlain = jsonPlain.toLowerCase();

    if (jsonPlain.startsWith("json")) {
      jsonPlain = jsonPlain.slice(4);
    }

    if (jsonPlain.startsWith("```json")) {
      jsonPlain = jsonPlain.slice(7, -3);
    }

    if (jsonPlain.startsWith("```")) {
      jsonPlain = jsonPlain.slice(3, -3);
    }

    try {
      const jsonParsed = JSON.parse(jsonPlain);
      const jsonIgnore = jsonParsed.ignore;
      const jsonRule = jsonParsed.rule;

      if (jsonRule) {
        console.log(`🗑️ Ignoring email because of rule: ${jsonRule}`);
      }

      return jsonIgnore;
    } catch {
      console.error("🚨 Error parsing JSON response from Gemini");
      console.error(jsonPlain);

      return false;
    }
  }
}

export default GeminiService;
