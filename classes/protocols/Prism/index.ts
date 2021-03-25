// Import local packages
import { Entry } from "./interface.ts";
import { Settings } from "../../../interface.ts";
import { Abstraction } from "../../Protocol.ts";
import { globalDatabase } from "../../../database.ts";

export class Prism implements Abstraction {
  public systemSettings: Settings = {};

  private imageUrl =
    `https://d340t73jilk763.cloudfront.net/659af632-37d4-4515-b17f-27f66e1b244c/Cam532/current_thumbnail.jpg?Expires=1670403772&Key-Pair-Id=APKAILAAGRVKMZUIHJ2A&Signature=CWHKWC6eCxr1~3ZnZYzFbnV1ZZFW4EK9yObCNt72E2pYVr8Ot7sbW3iL2rrHVgcDo3nnHE9bVCAhZ1i1Vx73RNE7-9wVtFhtklImGNsILWdR3fl9gdiPd4M-ZavYeOt4XqEhwJAgUWJ2khjZo7zqbSD4~DUabhmQwkbxkukVN0oDDJQZDScJYabCRr-OKIajtVwgLWIfMhM6IwDHP1-afn~yXsH0ULOCUNq~VaykrqKXGf8FCKKJ5lM2w0jo5KDml5IA3MOaQv3tGrmncFZQ6CB70zZDZgflXAO~3KvivCkyZVxxB6bDmDdoK1DhIuKwfK1ITCVqoOy9ceGrHJeJug__`;
  private imageDatabase = globalDatabase.collection<Entry>("prism");

  constructor(settingsObject: Settings) {
    this.systemSettings = settingsObject;
  }

  public async executeProtocol() {
    const response = await fetch(this.imageUrl);
    const creation = Date.now();
    const buffer = await response.arrayBuffer();

    this.imageDatabase.insertOne({ buffer, creation });
  }
}
