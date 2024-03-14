import axios from "axios";

export async function fetchNFTMetadata(mintAddress: string) {
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

  const metadata = response.data.content.metadata;

  const uri = metadata.uri;

  const JSONmetadata = await axios.get(uri);

  return JSONmetadata;
}
