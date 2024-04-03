import "dotenv/config";

import OpenAIService from "./services/OpenAIService";
import EmailService from "./services/EmailService";
import ReviewService from "./services/ReviewService";

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
  throw new Error("GEMINI_API_KEY is not defined");
}

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not defined");
}

if (!process.env.SUPABASE_KEY) {
  throw new Error("SUPABASE_KEY is not defined");
}

if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN is not defined");
}

console.log("🎉 Starting Bot-Ross");

const emailService = new EmailService();
const openaiService = new OpenAIService();
const reviewService = new ReviewService();

emailService.callback = async (
  uid: string,
  subject: string,
  content: string
) => {
  const cleaned = await openaiService.cleanEmail(content);
  const ignore = await openaiService.verifyEmail(subject, cleaned);

  if (ignore) {
    await emailService.ignoreEmail(uid);
  } else {
    await emailService.allowEmail(uid);
  }
};

await emailService.connect();
const emails = await emailService.fetchEmails();

for (const email of emails) {
  const cleaned = await openaiService.cleanEmail(email.content);
  const ignore = await openaiService.verifyEmail(email.subject, cleaned);

  if (ignore) {
    await emailService.ignoreEmail(email.uid);
  } else {
    await emailService.allowEmail(email.uid);
  }
}

reviewService.callback = (reviews) => {
  console.log(reviews);
};

await reviewService.connect();
