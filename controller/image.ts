// Import packages local
import { Image } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { decode } from "https://deno.land/std@0.63.0/encoding/base64.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Response } from "https://deno.land/x/oak/mod.ts";
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

// Create the databases
const imageDatabase = globalDatabase.collection<Image>("images");

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

  // Return the image to the user
  const semicolonIndex = image.base64!.indexOf(';')
  const colonIndex = image.base64!.indexOf(':')
  const commaIndex = image.base64!.indexOf(',')

  const imageSize = image.base64!.slice(colonIndex + 1, semicolonIndex);
  const imageData = image.base64!.slice(commaIndex + 1);

  response.headers.set('Content-Type', imageSize)
  response.body = base64.toUint8Array(imageData)
};

export { getImage };
