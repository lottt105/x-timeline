import { Outlet } from "react-router-dom";
import NavigationBar from "./navigation-bar";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr 1fr;
  padding: 50px 0px 0px;
  height: 100%;
  width: 100%;
  max-width: 860px;
`;

export default function Layout() {
  return (
    <Wrapper>
      <NavigationBar />
      <Outlet />
    </Wrapper>
  );
}
