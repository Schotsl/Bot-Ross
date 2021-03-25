// Import local packages
import {
  fetchContacts,
  insertContact,
  removeContact,
} from "../repositories/contactRepository.ts";

// Import packages from URL
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

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

  // Return to the user
  response.body = await insertContact(
    value.firstname,
    value.lastname,
    value.image,
  );
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

  // Return results to the user
  response.status = 200;
  response.body = await fetchContacts(limit, offset);
};

const deleteContact = async (
  { params, response }: { params: { id: string }; response: Response },
) => {
  // Remove the contact using the ID from the URL
  const result = await removeContact(params.id);
  response.status = result ? 204 : 404;
};

export { addContact, deleteContact, getContacts };
