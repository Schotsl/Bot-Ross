import "dotenv/config";

import { cleanEmail, verifyEmail } from "./utils/openai";
import { ignoreEmail, listenEmail } from "./utils/imapflow";

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

const onEmail = async (uid: string, subject: string, content: string) => {
  console.log(`📧 Received email with subject: ${subject}`);

  const cleaned = await cleanEmail(content);
  const ignore = await verifyEmail(subject, cleaned);

  if (ignore) {
    await ignoreEmail(uid);
  }
};

console.log("🎉 Starting Bot-Ross");

listenEmail(onEmail);
