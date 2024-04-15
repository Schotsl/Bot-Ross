import rules from "../rules.json";
import OpenAI from "openai";

import { Review } from "../types";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

class GenerativeService {
  ignoreModel: string;
  ignoreClient: GenerativeModel;

  reviewModel: string;
  reviewClient: OpenAI;

  constructor() {
    const googleClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    this.reviewModel = "ft:gpt-3.5-turbo-0125:personal:bot-ross:99s1R3P5";
    this.reviewClient = new OpenAI();

    this.ignoreModel = "gemini-1.5-pro-latest";
    this.ignoreClient = googleClient.getGenerativeModel(
      { model: this.ignoreModel },
      { apiVersion: "v1beta" },
    );
  }

  async respondReview(review: Review) {
    console.log(`🤖 Responding to review using ${this.reviewModel}`);

    const responseRaw = await this.reviewClient.chat.completions.create({
      model: this.reviewModel,
      messages: [
        {
          role: "system",
          content:
            "You're assigned the task of crafting replies to app reviews, bearing in mind that the style of response is influenced by the app's package name.",
        },
        {
          role: "user",
          content: JSON.stringify({
            package: review.package,
            rating: review.rating,
            review: review.review,
          }),
        },
      ],
    });

    const responseContent = responseRaw.choices[0].message.content!;
    return responseContent;
  }

  async verifyEmail(subject: string, html: string) {
    // Extra the body tag from the HTML if it exists
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/;
    const bodyMatch = html.match(bodyRegex);

    if (bodyMatch) {
      html = bodyMatch[1];
    }

    // Remove encoding and newlines
    html = html.replace(/=\r\n/g, "");
    html = html.replace(/=[0-9A-F]{2}/g, "");

    // Remove styles, scripts and comments tags and their content
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "");
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");
    html = html.replace(/<!--[\s\S]*?-->/g, "");

    // Remove other tags but not the content between them
    html = html.replace(/<[^>]*>/g, "");

    // Remove extra whitespace
    html = html.replace(/\s+/g, " ");

    // Remove any strings without spaces longer than 40 characters
    html = html.replace(/[^ ]{40,}/g, "");

    console.log(`🤖 Verifying email using ${this.ignoreModel}`);

    const requestRules = rules.join(",\n");
    const requestPrompt =
      `You are tasked with filtering emails based on their subject and content. You must return a JSON object with two properties. The first, 'ignore,' indicates whether the email should be ignored. The second, 'rule,' specifies the rule that led to ignoring the email, or null if the email should not be ignored. Do not return anything other than this JSON object! Don't ignore emails that require a action or a warning about something important or reporting errors. Consider the following rules when determining if an email should be ignored:\n${requestRules}\n\nSubject: ${subject}\n\nBody: ${html}`;
    const responseObject = await this.ignoreClient.generateContent([
      requestPrompt,
    ]);

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

export default GenerativeService;
