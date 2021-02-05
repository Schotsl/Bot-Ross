import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import { Label } from "./interface.ts";

const mongoClient = new MongoClient();

// Connect to the local database
mongoClient.connectWithUri("mongodb://localhost:27017");

// Export the database
export const globalDatabase = mongoClient.database("bot-ross");