export type User = {
  profile: Profile;
  telegram: Telegram;
  twitter: Twitter;
};

type Profile = {
  name: string;
  username: string;
  bio: string;
  image: string;
  pronouns: string;
};

type Telegram = {
  id: number;
  firstName: string;
  username: string;
};

type Twitter = {
  id: string;
  name: string;
  username: string;
  providerId: string;
};
