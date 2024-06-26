import "dotenv/config";

import EmailService from "./services/EmailService";
import ReviewService from "./services/ReviewService";
import DiscordService from "./services/DiscordService";
import GenerativeService from "./services/GenerativeService";

import { Review } from "./types";
import { createClient } from "@supabase/supabase-js";

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

if (!process.env.GEMINI_API_KEY) {
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

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

console.log("🎉 Starting Bot-Ross");

const emailService = new EmailService();
const reviewService = new ReviewService();
const discordService = new DiscordService();
const generativeService = new GenerativeService();

await emailService.connect();
await reviewService.connect();
await discordService.connect();

emailService.callback = async (
  uid: string,
  subject: string,
  content: string,
) => {
  console.log(`📧 Received email with subject: ${subject}`);

  const ignore = await generativeService.verifyEmail(subject, content);

  if (ignore) {
    console.log(`🚫 Ignoring email with UID: ${uid}`);

    await emailService.ignoreEmail(uid);
  } else {
    console.log(`✅ Allowing email with UID: ${uid}`);

    await emailService.allowEmail(uid);
  }
};

reviewService.callback = async (reviews: Review[]) => {
  console.log(`📝 Received ${reviews.length} reviews`);

  for (const review of reviews) {
    review.response = await generativeService.respondReview(review);
    review.discord = await discordService.sendApproval(review);

    const { error } = await supabase.from("reviews").upsert(review);

    if (error) {
      throw error;
    }
  }
};

discordService.callbackReplied = async (review: Review) => {
  console.log(`✅ Replied to review ${review.id}`);

  await reviewService.replyReview(review);
  await discordService.deleteApproval(review);

  const { error } = await supabase
    .from("reviews")
    .upsert({ ...review, discord: null });

  if (error) {
    throw error;
  }
};

discordService.callbackApproved = async (review: Review) => {
  console.log(`✅ Approved review ${review.id}`);

  await reviewService.replyReview(review);
  await discordService.deleteApproval(review);

  const { error } = await supabase
    .from("reviews")
    .upsert({ ...review, discord: null });

  if (error) {
    throw error;
  }
};

const emails = await emailService.fetchEmails();

console.log(`📧 Found ${emails.length} emails`);

for (const email of emails) {
  const { uid, subject, content } = email;

  console.log(`📧 Processing email with subject: ${subject}`);

  const ignore = await generativeService.verifyEmail(subject, content);

  if (ignore) {
    console.log(`🚫 Ignoring email with UID: ${uid}`);

    await emailService.ignoreEmail(uid);
  } else {
    console.log(`✅ Allowing email with UID: ${uid}`);

    await emailService.allowEmail(uid);
  }
}
