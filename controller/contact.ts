// Import packages local
import { Contact } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

const contactDatabase = globalDatabase.collection<Contact>("contacts");

const addContact = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  const image = value.image;
  const lastname = value.lastname;
  const firstname = value.firstname;

  if (image.length === 0) {
    response.body = `Invalid 'image' property`;
    response.status = 400;
    return;
  }

  if (lastname.length === 0) {
    response.body = `Invalid 'lastname' property`;
    response.status = 400;
    return;
  }

  if (firstname.length === 0) {
    response.body = `Invalid 'firstname' property`;
    response.status = 400;
    return;
  }

  // Insert the contact and return to the user
  const _id = await contactDatabase.insertOne({ image, lastname, firstname });
  response.body = { _id, image, lastname, firstname };
  response.status = 200;
};

const getContacts = async (
  { request, response }: { request: Request; response: Response },
) => {
  let limit = request.url.searchParams.get(`limit`)
    ? request.url.searchParams.get(`limit`)
    : 5;

  let offset = request.url.searchParams.get(`offset`)
    ? request.url.searchParams.get(`offset`)
    : 0;

  // Validate limit is a number
  if (isNaN(+offset!)) {
    response.body = `Invalid 'limit' property`;
    response.status = 400;
    return;
  }

  // Validate offset is a number
  if (isNaN(+offset!)) {
    response.body = `Invalid 'offset' property`;
    response.status = 400;
    return;
  }

  // Transform the strings into numbers
  limit = Number(limit);
  offset = Number(offset);

  // Get every contact
  const contacts = await contactDatabase.find().limit(limit).skip(offset);
  const total = await contactDatabase.count();

  // Return results to the user
  if (contacts) {
    response.status = 200;
    response.body = {
      contacts,
      offset,
      total,
    };
  }

  response.status = 404;
};

const deleteContact = async (
  { params, response }: { params: { _id: string }; response: Response },
) => {
  // Delete the contact
  const result = await contactDatabase.deleteOne({ _id: ObjectId(params._id) });

  // Return results to the user
  response.status = result ? 204 : 404;
};

const updateContact = async (
  { params, request, response }: {
    params: { _id: string };
    request: Request;
    response: Response;
  },
) => {
  const _id = ObjectId(params._id);

  // Get the stored contact
  const contact: Contact | null = await contactDatabase.findOne({ _id });

  // If no contact has been found
  if (!contact) {
    response.status = 404;
    return;
  }

  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  const image = value.image;
  const lastname = value.lastname;
  const firstname = value.firstname;

  if (image.length === 0) {
    response.body = `Invalid 'image' property`;
    response.status = 400;
    return;
  }

  if (lastname.length === 0) {
    response.body = `Invalid 'lastname' property`;
    response.status = 400;
    return;
  }

  if (firstname.length === 0) {
    response.body = `Invalid 'firstname' property`;
    response.status = 400;
    return;
  }

  // Update contact value
  await contactDatabase.updateOne({ _id }, {
    image,
    lastname,
    firstname,
  });

  // Return results to the user
  response.body = { _id, image, lastname, firstname };
  response.status = 200;
};

export { addContact, deleteContact, getContacts, updateContact };
