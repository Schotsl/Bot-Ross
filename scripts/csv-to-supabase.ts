import "dotenv/config";

import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

import { createClient } from "@supabase/supabase-js";

// Make sure to have a .env file with the following variables otherwise throw an error
if (!process.env.SUPABASE_URL) {
  throw new Error("IMAP_HOST is not defined");
}

if (!process.env.SUPABASE_KEY) {
  throw new Error("IMAP_PORT is not defined");
}

type Review = {
  id: string;
  package: string;
  rating: number;
  review: string;
  response: string;
};

// Directory containing the CSV files
const directory = "/Users/Schotsl/Downloads";

// Function to process a single file
function processFile(path: string) {
  return new Promise((resolve, reject) => {
    const results: Review[] = [];

    fs.createReadStream(path, { encoding: "utf16le" })
      .pipe(csvParser())
      .on("data", (data) => {
        const linkValue = data["Review Link"];
        const linkIndex = linkValue.indexOf("reviewId=");

        const linkId = linkValue.substring(linkIndex + 9);
        const linkIdTrimmed = linkId.substring(0, 36);

        if (linkIdTrimmed) {
          const review = {
            id: linkIdTrimmed,

            // Turn the object into array and get the first value
            package: Object.values(data)[0] as string,

            rating: data["Star Rating"] as number,
            review: data["Review Text"] as string,
            response: data["Developer Reply Text"] as string,
          };

          results.push(review);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", reject);
  });
}

// Read all files from the directory
fs.readdir(directory, async (error, filenames) => {
  if (error) {
    throw error;
  }

  // Create a new supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  for (const filename of filenames) {
    if (path.extname(filename) === ".csv") {
      const filePath = path.join(directory, filename);
      const fileData = await processFile(filePath);

      // Upsert the data into the database
      await supabase.from("reviews").upsert(fileData);
    }
  }
});
