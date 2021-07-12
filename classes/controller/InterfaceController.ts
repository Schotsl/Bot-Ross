import { Request, Response } from "https://deno.land/x/oak@v7.7.0/mod.ts";

export default interface interfaceController {
  getCollection(
    { request, response }: { request: Request; response: Response },
  ): void;
  removeObject(
    { params, response }: { params: { uuid: string }; response: Response },
  ): void;
  addObject(
    { request, response }: { request: Request; response: Response },
  ): void;
}
