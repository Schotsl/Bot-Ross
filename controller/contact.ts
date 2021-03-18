// Import packages local
import { Contact, Image } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

// Create the databases
const imageDatabase = globalDatabase.collection<Image>("images");
const contactDatabase = globalDatabase.collection<Contact>("contacts");

const addContact = async (
  { request, response }: { request: Request; response: Response },
) => {
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

  // Create the image and insert it
  const imageObject = new Image(value.image);
  const imageWrapper = await imageDatabase.insertOne(imageObject);

  // Create the contact with an image reference and insert it
  const contactObject = new Contact(
    value.firstname,
    value.lastname,
    imageWrapper,
  );
  const contactWrapper = await contactDatabase.insertOne(contactObject);

  // Simplify the ID for the rest API
  contactObject.id = contactWrapper.$oid.toString();

  if (typeof contactObject.image === "object") {
    contactObject.image = contactObject.image.$oid.toString();
  }

  // Return to the user
  response.body = contactObject;
  response.status = 200;
};

const getContacts = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch variables from URL GET parameters
  let limit = request.url.searchParams.get(`limit`)
    ? request.url.searchParams.get(`limit`)
    : 5;

  let offset = request.url.searchParams.get(`offset`)
    ? request.url.searchParams.get(`offset`)
    : 0;

  // Validate limit is a number
  if (isNaN(+limit!)) {
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

  // Simplify the ID for the rest API
  contacts.map((contact) => {
    contact.id = contact._id!.$oid.toString();
    contact._id = undefined;

    if (typeof contact.image === "object") {
      contact.image = contact.image.$oid.toString();
    }
  });

  // Return results to the user
  response.status = 200;
  response.body = {
    contacts,
    offset,
    total,
  };
};

const deleteContact = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  // Get the contact using the ID from the URL
  const contact = await contactDatabase.findOne({ _id: ObjectId(params.id) });

  // If there is no contact found
  if (!contact) {
    response.status = 404;
    return;
  }

  // Delete the image if the contact contains one
  if (contact.image && typeof contact.image === "object") {
    await imageDatabase.deleteOne({ _id: contact.image });
  }

  // Delete the contact and return results to the user
  await contactDatabase.deleteOne({ _id: ObjectId(params.id) });
  response.status = 204;
};

export { addContact, deleteContact, getContacts };
