export default class BaseModel {
  public static prepare(data: any) {
    data.id = data._id.toString();
    // delete data._id;
    return data;
  }
}
