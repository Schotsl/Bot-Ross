import rules from "../rules.json";
import OpenAI from "openai";

class OpenAIService {
  client: OpenAI;

  constructor() {
    this.client = new OpenAI();
  }

  async cleanEmail(html: string) {
    console.log(`🤖 Normalizing email using gpt-3.5-turbo`);

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

    const responseRaw = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Your task is to clean up an email by removing unnecessary content and random junk, retaining only the important parts. If the email is not in English, please translate it to English.`,
        },
        {
          role: "user",
          content: html,
        },
      ],
    });

    const responseContent = responseRaw.choices[0].message.content!;
    return responseContent;
  }

  async verifyEmail(subject: string, body: string) {
    console.log(`🤖 Verifying email using gpt-4`);

    const requestRules = rules.join(",\n");
    const requestResponse = await this.client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are tasked with filtering emails based on their subject and content. You must return a JSON object with two properties. The first, 'ignore,' indicates whether the email should be ignored. The second, 'rule,' specifies the rule that led to ignoring the email, or null if the email should not be ignored. If in doubt don't ignore the email, consider the following rules when determining if an email should be ignored: ${requestRules}`,
        },
        {
          role: "user",
          content: `Subject: ${subject}\n\n${body}`,
        },
      ],
      functions: [
        {
          name: "verifyEmail",
          parameters: {
            type: "object",
            properties: {
              ignore: {
                type: "boolean",
                description:
                  "Indicates whether the email should be ignored or not",
              },
              rule: {
                type: "string",
                description:
                  "The rule that led to ignoring the email, or null if the email should not be ignored",
              },
            },
          },
        },
      ],
      function_call: { name: "verifyEmail" },
    });

    const responseRaw =
      requestResponse.choices[0].message.function_call?.arguments!;

    const responseParsed = JSON.parse(responseRaw);

    if (responseParsed.rule) {
      console.log(`🗑️ Ignoring email because of rule: ${responseParsed.rule}`);
    }

    return responseParsed.ignore;
  }
}

export default OpenAIService;
