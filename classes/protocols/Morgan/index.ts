// Import packages local
import { Contact } from "../../../api/contact/class.ts";
import { Required } from "../../../enum.ts";
import { Settings } from "../../../interface.ts";
import { ContactAPI } from "../../../api/contact/index.ts";
import { Abstraction } from "../../Protocol.ts";
import { wildcardMatch } from "../../../helper.ts";
import { Dictionary, Expense } from "./interface.ts";
import { globalDatabase } from "../../../database.ts";

// Import packages from URL
import {
  Message,
  sendDirectMessage,
} from "https://deno.land/x/discordeno@10.0.1/mod.ts";

export class Morgan implements Abstraction {
  public systemSettings: Settings = {};
  public messageTriggers = [`Add * euro`, `Let's yeet this yeast`, `Report`];
  public requiredSettings = [Required.Discord];

  private contactAPI: ContactAPI;
  private databaseAPI = globalDatabase.collection<Expense>(`morgan`);

  private storedAmount?: number;
  private storedContent?: string;
  private storedContacts: Array<Contact> = [];

  constructor(settingsObject: Settings) {
    this.systemSettings = settingsObject;
    this.contactAPI = new ContactAPI();
  }

  public async executeMessage(message: Message): Promise<boolean> {
    const content = message.content;
    const author = message.author.id;

    if (wildcardMatch(content, [`Let's yeet this yeast`, `Report`])) {
      let message = `>>> ${content}`;

      const expenses = await this.databaseAPI.find();
      const dictionary: Dictionary = {};

      if (expenses.length === 0) {
        sendDirectMessage(author, `No outstanding debts`);
        return false;
      }

      // Create an object with the contact UUID as key so we can sum al the expenses
      expenses.forEach((expense) => {
        const contacts = expense.contacts;
        const amount = expense.amount;
        const count = contacts.length;

        contacts.forEach((uuid) => {
          if (dictionary[uuid]) dictionary[uuid] += amount / count;
          else dictionary[uuid] = amount / count;
        });
      });

      // Loop over every contact in the dictionary and format it
      for (const key in dictionary) {
        const value = dictionary[key];
        const contact = this.contactAPI.getContact(key);

        const title = contact ? contact.fullname : `Unknown`;
        message += `\n**${title}**: € ${value}`;
      }

      sendDirectMessage(author, message);
      return false;
    }

    // If we we're adding a new entry
    if (wildcardMatch(content, `Add * euro`)) {
      const matches = content.match(/\d+/g);

      // Make sure the value is a number
      if (!matches || matches.length === 0) {
        sendDirectMessage(author, `Invalid input`);
        return false;
      }

      // Store the number
      this.storedAmount = Number(matches[0]);
      sendDirectMessage(author, `What did you buy?`);
      return true;
    }

    // If a price has been set but not a description
    if (this.storedAmount && !this.storedContent) {
      this.storedContent = content;
      sendDirectMessage(author, `Who owns this money?`);
      return true;
    }

    if (wildcardMatch(content, `Done`)) {
      if (this.storedAmount && this.storedContacts) {
        const description = this.storedContent!;
        const insertion = Date.now();
        const contacts = this.storedContacts.map((contact) => contact.uuid);
        const amount = this.storedAmount;

        this.databaseAPI.insertOne(
          { description, amount, contacts, insertion },
        );

        sendDirectMessage(author, `Beep, beep, boop!`);
        return false;
      }
    }

    // Search the contact by name
    const contacts = this.contactAPI.searchContacts(content);

    // Abort if no contact is found
    if (contacts.length === 0) {
      message.reply(`I 'cant find anyone with that name`);
      return true;
    }

    // Insert the data into storage
    const contact = contacts[0];
    message.reply(contact.fullname);
    this.storedContacts.push(contact);

    return true;
  }
}
