import { styled } from "styled-components";
import { MessageType } from "../../types";
import Message from "./Message";

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
      {tweets.map((tweet) => (
        <Message key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
