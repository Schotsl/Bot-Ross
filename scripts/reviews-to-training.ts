import "dotenv/config";

import fs from "fs";

import { createClient } from "@supabase/supabase-js";

// Make sure to have a .env file with the following variables otherwise throw an error
if (!process.env.SUPABASE_URL) {
  throw new Error("IMAP_HOST is not defined");
}

if (!process.env.SUPABASE_KEY) {
  throw new Error("IMAP_PORT is not defined");
}

// Create a new supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

const reviews = await supabase
  .from("reviews")
  .select("*")
  .eq("generative", false);

const reviewsData = reviews.data || [];

const prompt =
  "You're assigned the task of crafting replies to app reviews, bearing in mind that the style of response is influenced by the app's package name.";

const training = reviewsData.map((review) => {
  return {
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: JSON.stringify({
          package: review.package,
          rating: review.rating,
          review: review.review,
        }),
      },
      { role: "assistant", content: review.response },
    ],
  };
});

// Write to a jsonl file
const fileData = training.map((data) => JSON.stringify(data)).join("\n");
const filePath = "./training.jsonl";

fs.writeFileSync(filePath, fileData);

console.log(`✅ Created training file at ${filePath}`);
