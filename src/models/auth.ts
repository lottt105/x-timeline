export type RegisterType = {
  name: string;
  email: string;
  password: string;
};

export type LoginType = Omit<RegisterType, "name">;

export type ProfileType = {
  name: string | null;
  photoUrl?: string | null;
};
