export type RegisterType = {
  name: string;
  email: string;
  password: string;
};

export type LoginType = Omit<RegisterType, "name">;

export type ProfileType = {
  name: string;
  photoUrl?: string;
};

export type MessageType = {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  userPhoto?: string;
  createdAt: number;
};

export type PostMessageType = {
  tweet: string;
  file?: FileList;
};
