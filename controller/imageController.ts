// Import local packages
import { Image } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Response } from "https://deno.land/x/oak/mod.ts";
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

// Create the databases
const imageDatabase = globalDatabase.collection<Image>("image_1");

const getImage = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  // Get the image using the ID from the URL
  const image = await imageDatabase.findOne({ _id: ObjectId(params.id) });

  // If there is no image found
  if (!image) {
    response.status = 404;
    return;
  }

  // Transform to Unit8Array and fetch the length
  const data = base64.toUint8Array(image.base64);
  const length = data.byteLength.toString();

  // Return data to user
  response.headers.set("Content-Length", length);
  response.headers.set("Content-Type", "image/png");

  response.body = base64.toUint8Array(image.base64);
};

export { getImage };
