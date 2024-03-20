import "dotenv/config";

import { ImapFlow } from "imapflow";

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

const host = process.env.IMAP_HOST!;
const user = process.env.IMAP_USER!;
const pass = process.env.IMAP_PASSWORD;
const port = Number(process.env.IMAP_PORT!);

async function fetchEmails() {
  console.log("Fetching emails");

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

  const lock = await client.getMailboxLock("INBOX");

  try {
    const messages = await client.fetch("1:*", {
      envelope: true,
      source: true,
    });

    for await (const message of messages) {
      console.log(`${message.uid}: ${message.envelope.subject}`);
      // console.log(`\n${message.source.toString()}`);
    }
  } finally {
    lock.release();
  }

  await client.logout();
}

setInterval(fetchEmails, 10000);
