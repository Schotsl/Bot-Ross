import { ImapFlow } from "imapflow";
import 'dotenv/config'

async function fetchEmails() {
  console.log("Fetching emails");

  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    logger: false,
    auth: {
      user: process.env.IMAP_USER,
      pass: process.env.IMAP_PASSWORD,
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