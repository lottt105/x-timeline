import { styled } from "styled-components";
import { MessageType } from "../../types";
import Message from "./Message";
import { AnimatePresence } from "framer-motion";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
`;

export default function MessageContainer({
  tweets,
}: {
  tweets: MessageType[];
}) {
  return (
    <Wrapper>
      <AnimatePresence>
        {tweets.map((tweet) => (
          <Message key={tweet.id} {...tweet} />
        ))}
      </AnimatePresence>
    </Wrapper>
  );
}
