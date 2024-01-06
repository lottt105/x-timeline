import { Unsubscribe } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { MessageType } from "../../types";
import MessageContainer from "../message/MessageContainer";

export default function Timeline() {
  const [tweets, setTweets] = useState<MessageType[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
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
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return <MessageContainer tweets={tweets} />;
}
