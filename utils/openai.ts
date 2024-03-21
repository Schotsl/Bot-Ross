import OpenAI from "openai";
import options from "../options.json";

import { stripHtml } from "string-strip-html";

export async function cleanEmail(html: string) {
  const openai = new OpenAI();

  const strippedResponse = stripHtml(html);
  const strippedResults = strippedResponse.result.trim();

  const responseRaw = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          `You are tasked with cleaning up an email from unnecessary content and random junk.`,
      },
      {
        role: "user",
        content: strippedResults,
      },
    ],
  });

  const responseContent = responseRaw.choices[0].message.content!;
  return responseContent;
}

export async function verifyEmail(subject: string, body: string) {
  const openai = new OpenAI();

  const rulesArray = options.rules;
  const rulesFormatted = rulesArray.join(",\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          `You are tasked with filtering emails based on their subject and content. You have to return a JSON object with a property called "ignore", this property indicates whether or not the email should be ignored. Consider the following rules when determining if a email should be ignored:\n${rulesFormatted}`,
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
          },
        },
      },
    ],
    function_call: { name: "verifyEmail" },
  });

  const responseRaw = response.choices[0].message.function_call?.arguments!;
  const responseParsed = JSON.parse(responseRaw);

  return responseParsed.ignore;
}
