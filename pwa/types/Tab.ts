import { Item } from "./item";

export class Tab implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public capo?: number,
    public content?: string,
    public tags?: string[],
    public artist?: string
  ) {
    this["@id"] = _id;
  }
}
