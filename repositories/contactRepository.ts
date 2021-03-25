// Import local packages
import { Contact, ContactCollection, Image } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";

// Create the databases
const imageDatabase = globalDatabase.collection<Image>("image_1");
const contactDatabase = globalDatabase.collection<Contact>("contact_1");

export async function fetchContacts(
  limit = 3,
  offset = 0,
): Promise<ContactCollection> {
  const contacts = await contactDatabase.find().limit(limit).skip(offset);
  const total = await contactDatabase.count();

  return { limit, total, offset, contacts: mapArray(contacts) };
}

export async function fetchContact(id: string): Promise<Contact> {
  const contact = await contactDatabase.findOne({ _id: ObjectId(id) });

  return mapObject(contact!);
}

export async function insertContact(
  firstname: string,
  lastname: string,
  image?: string,
): Promise<Contact> {
  const contact: Contact = { firstname, lastname, image };

  // If a image has been provided insert it into the database and add a refrence to the contact object
  if (image) contact._image = await imageDatabase.insertOne({ base64: image });
  contact._id = await contactDatabase.insertOne(contact);

  return mapObject(contact);
}

export async function removeContact(id: string): Promise<boolean> {
  // Delete the image if it has been set
  const contact = await contactDatabase.findOne({ _id: ObjectId(id) });
  if (contact && contact._image) {
    await imageDatabase.deleteOne({ _id: contact._image });
  }

  // Delete the contact and return the result
  return await contactDatabase.deleteOne({ _id: ObjectId(id) }) ? true : false;
}

function mapObject(contact: Contact): Contact {
  // Transform the image into a string if it has been provided
  if (contact._image) {
    contact.image = contact._image.$oid.toString();
    contact._image = undefined;
  }

  // Transform the ID into a string
  contact.id = contact._id!.$oid.toString();
  contact._id = undefined;

  return contact;
}

function mapArray(contacts: Array<Contact>): Array<Contact> {
  // Pass every array entry to the map object function
  contacts = contacts.map((contact) => mapObject(contact));

  // Return the parse array
  return contacts;
}
