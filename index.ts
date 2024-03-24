import "dotenv/config";

import OpenAIService from "./services/openai";
import EmailService from "./services/imapflow";

// Make sure to have a .env file with the following variables otherwise throw an error
if (!process.env.IMAP_HOST) {
  throw new Error("IMAP_HOST is not defined");
}

if (!process.env.IMAP_PORT) {
  throw new Error("IMAP_PORT is not defined");
}

if (!process.env.IMAP_USER) {
  throw new Error("IMAP_USER is not defined");
}

if (!process.env.IMAP_PASSWORD) {
  throw new Error("IMAP_PASSWORD is not defined");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

console.log("🎉 Starting Bot-Ross");

const emailService = new EmailService();
const openAIService = new OpenAIService();

emailService.callback = async (
  uid: string,
  subject: string,
  content: string
) => {
  const cleaned = await openAIService.cleanEmail(content);
  const ignore = await openAIService.verifyEmail(subject, cleaned);

  if (ignore) {
    await emailService.ignoreEmail(uid);
  }
};
