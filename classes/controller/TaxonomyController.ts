import { Client } from "https://deno.land/x/mysql/mod.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

import TaxonomyEntity from "../entity/TaxonomyEntity.ts";
import TaxonomyRepository from "../repository/TaxonomyRepository.ts";
import InterfaceController from "./InterfaceController.ts";

export default class TaxonomyController implements InterfaceController {
  private taxonomyRepository: TaxonomyRepository;

  constructor(client: Client) {
    this.taxonomyRepository = new TaxonomyRepository(client);
  }

  public async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch the body parameters
    const body = await request.body();
    const value = await body.value;

    // Check if required properties have been provided
    if (!value.title) {
      response.body = `Missing 'title' property`;
      response.status = 400;
      return;
    }

    // Validate the properties values
    if (value.title.length < 3 || value.title.length > 255) {
      response.body = `Invalid title' property`;
      response.status = 400;
      return;
    }

    // Create the Taxonomy object
    const taxonomy = new TaxonomyEntity();

    taxonomy.title = value.title;

    // Insert into the database and return to the user
    response.body = await this.taxonomyRepository.addObject(taxonomy);
    response.status = 200;
  }

  public async getCollection(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch limit and offset from the GET parameters for pagination
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
    response.body = await this.taxonomyRepository.getCollection(offset, limit);
  }

  public async removeObject(
    { params, response }: { params: { uuid: string }; response: Response },
  ) {
    // Remove the taxonomy using the UUID from the URL
    const result = await this.taxonomyRepository.removeObject(params.uuid);
    response.status = result ? 204 : 404;
  }
}
