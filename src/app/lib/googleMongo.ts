import { db } from "./mongoClient";

export function getGoogleToken() {
  return db.collection("googleTokens").findOne({});
}
