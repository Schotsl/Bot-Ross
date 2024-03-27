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

    const strippedResponse = stripHtml(html);
    const strippedResults = strippedResponse.result.trim();

    const responsePrompt =
      `You are tasked with cleaning up an email from unnecessary content and random junk, only leave the important parts of the email. The email is as follows:\n\n${strippedResults}`;
    const responseObject = await this.model.generateContent([responsePrompt]);
    const responseText = responseObject.response.text();

    return responseText;
  }

  async verifyEmail(subject: string, body: string) {
    console.log(`🤖 Verifying email using ${this.name}`);

    const requestRules = rules.join(",\n");
    const requestPrompt =
      `You are tasked with filtering emails based on their subject and content. You have to return a JSON object with a property called "ignore", this property indicates whether or not the email should be ignored. Don't return anything else except the JSON object! Consider the following rules when determining if a email should be ignored:\n${requestRules}\n\nSubject: ${subject}\n\nBody: ${body}`;

    const responseObject = await this.model.generateContent([requestPrompt]);
    const responseText = responseObject.response.text();

    // Turn the response with markdown into a JSON object
    const jsonPlain = responseText.slice(7, -3);
    const jsonCleaned = jsonPlain.replace(/(\r\n|\n|\r)/gm, "");
    const jsonTrimmed = jsonCleaned.trim();

    try {
      const jsonParsed = JSON.parse(jsonTrimmed);
      const jsonIgnore = jsonParsed.ignore;

      return jsonIgnore;
    } catch {
      console.error("🚨 Error parsing JSON response from Gemini");
      console.error(jsonTrimmed);

      return false;
    }
  }
}

export default GeminiService;
