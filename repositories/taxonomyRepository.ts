// Import local packages
import { Taxonomy, TaxonomyCollection } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";

// Create the databases
const taxonomyDatabase = globalDatabase.collection<Taxonomy>("taxonomy_1");

export async function fetchTaxonomies(
  limit = 3,
  offset = 0,
): Promise<TaxonomyCollection> {
  const taxonomies = await taxonomyDatabase.find().limit(limit).skip(offset);
  const total = await taxonomyDatabase.count();

  return { limit, total, offset, taxonomies: mapArray(taxonomies) };
}

export async function fetchTaxonomy(id: string): Promise<Taxonomy> {
  const taxonomy = await taxonomyDatabase.findOne({ _id: ObjectId(id) });

  return mapObject(taxonomy!);
}

export async function insertTaxonomy(title: string) {
  const taxonomy: Taxonomy = { title };

  // Insert into the database
  taxonomy._id = await taxonomyDatabase.insertOne(taxonomy);

  return mapObject(taxonomy);
}

export async function removeTaxonomy(id: string): Promise<boolean> {
  // Delete the contact and return the result
  return await taxonomyDatabase.deleteOne({ _id: ObjectId(id) }) ? true : false;
}

function mapObject(taxonomy: Taxonomy): Taxonomy {
  // Transform the ID into a string
  taxonomy.id = taxonomy._id!.$oid.toString();
  taxonomy._id = undefined;

  return taxonomy;
}

function mapArray(taxonomies: Array<Taxonomy>): Array<Taxonomy> {
  // Pass every array entry to the map object function
  taxonomies = taxonomies.map((taxonomy) => mapObject(taxonomy));

  // Return the parse array
  return taxonomies;
}
