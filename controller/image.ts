// Import packages local
import { Image } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { decode } from "https://deno.land/std@0.63.0/encoding/base64.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Response } from "https://deno.land/x/oak/mod.ts";

// Create the databases
const imageDatabase = globalDatabase.collection<Image>("images");

const getImage = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  console.log('bruh');
  // Get the image using the ID from the URL
  const image = await imageDatabase.findOne();

  // If there is no image found
  if (!image) {
    response.status = 404;
    return;
  }

  
};

export { getImage };
