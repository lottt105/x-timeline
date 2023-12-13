export type TweetType = {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  userPhoto?: string;
  createdAt: number;
};

export type PostTweetType = {
  tweet: string;
  file: FileList | null;
};
