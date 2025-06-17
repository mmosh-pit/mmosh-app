import axios from "axios";
import client from "../httpClient";

export const updateUserData = async (params: any, wallet: string) => {
  await client.put("/update-user-data", {
    field: "profile",
    value: params,
    wallet: wallet,
  });
};
