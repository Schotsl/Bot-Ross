import "dotenv/config";

import GeminiService from "./services/gemini";
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

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

console.log("🎉 Starting Bot-Ross");

const emailService = new EmailService();
const geminiService = new GeminiService();

emailService.callback = async (
  uid: string,
  subject: string,
  content: string
) => {
  const cleaned = await geminiService.cleanEmail(content);
  const ignore = await geminiService.verifyEmail(subject, cleaned);

  if (ignore) {
    await emailService.ignoreEmail(uid);
  } else {
    await emailService.allowEmail(uid);
  }
};

await emailService.connect();
const emails = await emailService.fetchEmails();

for (const email of emails) {
  try {
    const cleaned = await geminiService.cleanEmail(email.content);
    const ignore = await geminiService.verifyEmail(email.subject, cleaned);

    if (ignore) {
      await emailService.ignoreEmail(email.uid);
    } else {
      await emailService.allowEmail(email.uid);
    }
  } catch (error) {
    console.error(error);

    await emailService.errorEmail(email.uid);
  }
}
