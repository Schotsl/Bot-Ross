import { Client } from "https://deno.land/x/mysql/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

import ContactEntity from "../entity/ContactEntity.ts";
import ContactRepository from "../repository/ContactRepository.ts";
import InterfaceController from "./InterfaceController.ts";

import { Image } from "https://deno.land/x/imagescript/mod.ts";
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

export default class ContactController implements InterfaceController {
  private contactRepository: ContactRepository;

  constructor(client: Client) {
    this.contactRepository = new ContactRepository(client);
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch the body parameters
    const body = await request.body();
    const value = await body.value;

    // Check if required properties have been provided
    if (!value.lastname) {
      response.body = `Missing 'lastname' property`;
      response.status = 400;
      return;
    }

    if (!value.firstname) {
      response.body = `Missing 'firstname' property`;
      response.status = 400;
      return;
    }

    // Validate the properties values
    if (value.lastname.length < 3 || value.lastname.length > 255) {
      response.body = `Invalid 'lastname' property`;
      response.status = 400;
      return;
    }

    if (value.firstname.length < 3 || value.firstname.length > 255) {
      response.body = `Invalid 'firstname' property`;
      response.status = 400;
      return;
    }

    // Create the Contact object
    const contact = new ContactEntity();

    contact.lastname = value.lastname;
    contact.firstname = value.firstname;

    let image: Image | undefined;

    // If an image has been provided by the user
    if (value.image) {
      // Convert the base65 into an Image instance
      const array = base64.toUint8Array(value.image);
      image = await Image.decode(array);

      // Validate image size and aspect ratio
      if (image.width !== image.height) {
        response.body = `Invalid 'image' aspect ratio`;
        response.status = 400;
        return;
      }

      if (image.width < 128 || image.height < 128) {
        response.body = `Invalid 'image' size`;
        response.status = 400;
        return;
      }

      contact.image = true;
    }

    // Insert into the database the store the result
    const result = await this.contactRepository.addObject(contact);

    if (contact.image) {
      // Save the image as 128 x 128 using the Contact UUID
      image!.resize(128, 128);
      await Deno.writeFile(
        `./image/contact/${result.uuid}.png`,
        await image!.encode(),
      );
    }

    response.body = result;
    response.status = 200;
  }

  async getCollection(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch variables from URL GET parameters
    let limit = request.url.searchParams.get(`limit`)
      ? request.url.searchParams.get(`limit`)
      : 5;

    let offset = request.url.searchParams.get(`offset`)
      ? request.url.searchParams.get(`offset`)
      : 0;

    // Validate limit is a number
    if (isNaN(+limit!)) {
      response.body = `Invalid limit' property`;
      response.status = 400;
      return;
    }

    // Validate offset is a number
    if (isNaN(+offset!)) {
      response.body = `Invalid offset' property`;
      response.status = 400;
      return;
    }

    // Transform the strings into numbers
    limit = Number(limit);
    offset = Number(offset);

    // Return results to the user
    response.status = 200;
    response.body = await this.contactRepository.getCollection(offset, limit);
  }

  async removeObject(
    { params, response }: { params: { uuid: string }; response: Response },
  ) {
    // Remove the contact using the UUID from the URL
    const result = await this.contactRepository.removeObject(params.uuid);

    // Delete the image if it exists
    if (result && existsSync(`./image/contact/${params.uuid}.png`)) {
      Deno.remove(`./image/contact/${params.uuid}.png`);
    }

    response.status = result ? 204 : 404;
  }
}
