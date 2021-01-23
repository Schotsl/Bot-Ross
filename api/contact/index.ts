// Import packages local
import { Contact } from "./class.ts";

// Import packages from URL
// @deno-types="https://deno.land/x/fuse@v6.4.1/dist/fuse.d.ts"
import Fuse from "https://deno.land/x/fuse@v6.4.1/dist/fuse.esm.min.js";

export class ContactAPI {
  get contacts(): Array<Contact> {
    // Read the JSON file and parse it
    const decoder = new TextDecoder(`utf-8`);
    const bytes = Deno.readFileSync(`api/contact/data.json`);
    const decode = decoder.decode(bytes);
    const data = JSON.parse(JSON.parse(decode));

    // Transform the JSON array to Contacts
    const contacts = data.map((contact: Contact) => {
      return new Contact(
        contact.uuid,
        contact.firstname,
        contact.lastname,
        contact.insertion,
      );
    });

    return contacts;
  }

  public getContact(uuid: string): Contact | null {
    for (let i = 0; i < this.contacts.length; i ++) {
      const contact = this.contacts[i];

      // Return the matching user
      if (contact.uuid == uuid) return contact;
    };

    return null;
  }

  public searchContacts(query: string): Array<Contact> {
    // Search the keywords property which contains firstname, lastname and insertion
    const options = { keys: ["keywords"] };

    // Search the contacts
    const fuse = new Fuse(this.contacts, options);
    const results = fuse.search(query);

    // Return array of Contact objects
    return results.map((contact) => contact.item);
  }
}
