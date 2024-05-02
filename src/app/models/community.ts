import { ObjectId } from "mongodb";

export type Community = {
  _id?: ObjectId;
  name: string;
  symbol: string;
  desc: string;
  image: string;
  coinimage: string;
  token: string;
  project: string;
  lut: string;
  seniority: number;
  telegram: string;
  created_date: Date;
  updated_date: Date;
};
