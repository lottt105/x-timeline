import styled, { keyframes } from "styled-components";

const load = keyframes`
  0% {
      transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingCircle = styled.div`
  width: 50px;
  height: 50px;
  margin: 10px auto;

  border: 10px solid #e3e3e3;
  border-bottom: 10px solid #000000;
  border-radius: 50%;

  animation: ${load} 1.5s linear infinite;
`;

export default function Loading() {
  return (
    <Wrapper>
      <LoadingCircle />
    </Wrapper>
  );
}
