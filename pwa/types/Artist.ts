import { Item } from "./item";

export class Artist implements Item {
  public "@id"?: string;

  constructor(_id?: string, public name?: string, public tabs?: string[]) {
    this["@id"] = _id;
  }
}
