import {
  query,
  collection,
  orderBy,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { MessageType } from "../../types";
import MessageContainer from "../message/MessageContainer";

export default function ProfileMessages() {
  const user = auth.currentUser;
  // 사용자 본인 작성한 트윗 데이터 리스트
  const [tweets, setTweets] = useState<MessageType[]>([]);

  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      where("userId", "==", user?.uid),
      limit(25)
    );
    const tweetDocs = await getDocs(tweetsQuery);
    const tweets = tweetDocs.docs.map((doc) => {
      const { tweet, createdAt, userId, username, userPhoto, photo } =
        doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        userPhoto,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return <MessageContainer tweets={tweets} />;
}
