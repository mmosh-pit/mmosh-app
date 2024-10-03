type GroupCommunity = {
  name: string;
  description: string;
  asset: string;
  passImage: string;
  symbol: string;
  groups: Group[];
};

type Group = {
  handle: string;
  privacy: string;
  assetPrice: number;
};
