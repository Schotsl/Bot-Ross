import "dotenv/config";

import OpenAI from "openai";

import { ImapFlow } from "imapflow";
import { stripHtml } from "string-strip-html";

// Load options.json
import options from "./options.json";

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

const host = process.env.IMAP_HOST!;
const user = process.env.IMAP_USER!;
const pass = process.env.IMAP_PASSWORD;
const port = Number(process.env.IMAP_PORT!);

async function verifyEmail(subject: string, body: string) {
  const openai = new OpenAI();

  const rulesArray = options.rules;
  const rulesFormatted = rulesArray.join(",\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are tasked with filtering emails based on their subject and content. Consider the following rules:\n${rulesFormatted}`,
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

async function markEmail(client: ImapFlow, uid: string) {
  const config = { useLabels: true };

  await Promise.all([
    client.messageFlagsAdd({ uid }, ["\\Seen"]),
    client.messageFlagsRemove({ uid }, ["\\Inbox"], config),
    client.messageMove({ uid }, "Ignore", { uid: true }),
  ]);
}

async function listenEmail() {
  console.log("Listening for new emails...");

  const client = new ImapFlow({
    host,
    port,
    logger: false,
    auth: {
      user,
      pass,
    },
  });

  await client.connect();
  await client.mailboxOpen("INBOX");

  client.on("exists", async (exists) => {
    const countCurrent = exists.count;
    const countPrevious = exists.prevCount;

    const countDiff = countCurrent - countPrevious;
    const countStart = countCurrent - countDiff + 1;

    // Only fetch the new emails
    const messages = client.fetch(`${countStart}:${countCurrent}`, {
      envelope: true,
      source: true,
    });

    for await (const message of messages) {
      const uid = message.uid.toString();
      const subject = message.envelope.subject;

      const content = message.source.toString();
      const contentStripped = stripHtml(content).result;

      const ignore = await verifyEmail(subject, contentStripped);

      if (ignore) {
        console.log(`Ignoring email with subject: ${subject}`);

        await markEmail(client, uid);
      } else {
        console.log(`Allowing email with subject: ${subject}`);
      }
    }
  });
}

listenEmail();
