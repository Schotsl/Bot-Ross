import { globalDatabase } from "../database.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Label } from "../interface.ts";

const labelDatabase = globalDatabase.collection<Label>("labels");

const addLabel = async ({ request, response }: { request: any; response: any }) => {
  const body = await request.body();
  const value = await body.value;
  const label = {
    emoji: value.emoji,
    titel: value.title,
  }

  labelDatabase.insertOne(label);

  response.body = label;
  response.status = 200;
}

const getLabels = async ({ request, response }: { request: any; response: any }) => {
  const labels = await labelDatabase.find();

  if (labels) {
    response.status = 200;
    response.body = labels;
  } else {
    response.status = 404
  }
}

const deleteLabel = async ({ params, response }: { params: { uuid: string }; response: any }) => {
  const uuid = params.uuid;
  const result = await labelDatabase.deleteOne({_id: ObjectId(uuid)});
 
  if (result) response.status = 204;
  else response.status = 404;
}

const updateLabel = async ({ params, request, response }: { params: { uuid: string }; request: any; response: any }) => {
  const uuid = params.uuid;
  const label: Label | null = await labelDatabase.findOne({_id: ObjectId(uuid)});

  if (label) {
    const body = await request.body();
    const value = await body.value;
   
    await labelDatabase.updateOne({_id: ObjectId(uuid)}, value);
    const label = await labelDatabase.findOne({_id: ObjectId(uuid)});

    response.status = 200
    response.body = label
  } else {
    response.status = 404;
  }  
}

export { addLabel, getLabels, deleteLabel, updateLabel }