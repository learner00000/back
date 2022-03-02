import { stockCollection } from "../mongo.ts";
import BaseModel from "./base_model.ts";

export default class Stock extends BaseModel {
  public _id: string = "";
  public open: string = "";
  public high: string = "";
  public low: string = "";
  public close: string = "";
  public volume: string = "";


  constructor({ _id = "", open = "", high = "", low = "" ,close = "", volume = "" }) {
    super();
    this._id = _id;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;

  }

  static async findOne(params: object): Promise<Stock | null> {
    const stock = await stockCollection.findOne(params);
    if (!stock) {
      console.log('there is no stock');
      return null;
    }
    console.log('there is a stock');

    return new Stock(Stock.prepare(stock));
  }

  async save(stock : Stock) {
    this._id  = await stockCollection.insertOne(stock);
    // delete stock._id;
    return this;
  }
}
