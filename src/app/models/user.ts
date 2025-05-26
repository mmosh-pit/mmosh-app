export type User = {
  name: string;
  email: string;
  wallet: string;
  profile: Profile;
  telegram: Telegram;
  twitter: Twitter;
  profilenft: string;
  royalty: number;
  guest_data: GuestData;
  onboarding_step: number;
};

type GuestData = {
  picture: string;
  banner: string;
  name: string;
  username: string;
  website: string;
  pronouns: string;
  bio: string;
};

type Profile = {
  name: string;
  username: string;
  bio: string;
  image: string;
  pronouns: string;
  seniority: number;
  descriptor: string;
  nouns: string;
  following: number;
  follower: number;
  connectionnft: string;
  connectionbadge: string;
  connection: number;
  isprivate: boolean;
  request: boolean;
};

type Telegram = {
  id: number;
  firstName: string;
  username: string;
  points: number;
};

type Twitter = {
  id: string;
  name: string;
  username: string;
  providerId: string;
};
