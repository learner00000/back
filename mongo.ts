import { MongoClient } from "./deps.ts";

const client = new MongoClient();
await client.connect(Deno.env.get("MONGODB_URI") || "");


// export const user_db = client.database(Deno.env.get("DB1_NAME") || "");
// export const stock_db = client.database(Deno.env.get("DB2_NAME") || "");

// export default  user_db;

const user_db = client.database(Deno.env.get("DB1_NAME") || "");
const stock_db = client.database(Deno.env.get("DB2_NAME") || "");

export {
    user_db as default,
    user_db,
    stock_db,
  };

export const userCollection = user_db.collection("users");
export const stockCollection = stock_db.collection("stocks");



