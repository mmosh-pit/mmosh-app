import axios from "axios";

export async function fetchNFTUsername(mintAddress: string) {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
    JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAsset",
      params: {
        id: mintAddress,
      },
    }),
  );

  console.log("Got response: ", response);

  const metadata = response.data.content.metadata;

  const uri = metadata.uri;

  const JSONmetadata = await axios.get(uri);

  let username = "";
  for (const attribute of JSONmetadata.data.attributes) {
    if (attribute.trait_type.toLowerCase() === "username") {
      username = attribute.value;
    }
  }

  return { username };
}
