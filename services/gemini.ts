import options from "../options.json";

import { stripHtml } from "string-strip-html";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  client: GoogleGenerativeAI;
  model: GenerativeModel;

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    this.model = this.client.getGenerativeModel({
      model: "gemini-pro",
    });
  }

  async cleanEmail(html: string) {
    console.log("🤖 Cleaning email using gemini-pro");

    const strippedResponse = stripHtml(html);
    const strippedResults = strippedResponse.result.trim();

    const responsePrompt = `You are tasked with cleaning up an email from unnecessary content and random junk, only leave the important parts of the email. The email is as follows:\n\n${strippedResults}`;
    const responseObject = await this.model.generateContent([responsePrompt]);
    const responseText = responseObject.response.text();

    return responseText;
  }

  async verifyEmail(subject: string, body: string) {
    console.log("🤖 Verifying email using gemini-pro");

    const rulesArray = options.rules;
    const rulesFormatted = rulesArray.join(",\n");

    const responsePrompt = `You are tasked with filtering emails based on their subject and content. You have to return a JSON object with a property called "ignore", this property indicates whether or not the email should be ignored. Don't return anything else except the JSON object! Consider the following rules when determining if a email should be ignored:\n${rulesFormatted}\n\nSubject: ${subject}\n\nBody: ${body}`;
    const responseObject = await this.model.generateContent([responsePrompt]);
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
