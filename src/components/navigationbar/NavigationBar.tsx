import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import styled from "styled-components";
import { colors } from "../../resources/colors";
import Icon from "../../resources/icons";
import { useState } from "react";

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  position: relative;
  svg {
    width: 30px;
    fill: ${colors.deep_gray};
    padding-bottom: 0.25rem;
  }
  &.log-out {
    svg {
      fill: tomato;
    }
  }
  &.log-in {
    svg {
      fill: ${colors.deep_blue};
    }
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0.2rem;
    margin-left: 10%;
    background-color: ${colors.deep_gray};
    transition: width 0.1s linear;
  }
  &.log-out::after {
    background-color: tomato;
  }
  &.log-in::after {
    background-color: ${colors.deep_blue};
  }

  &:hover::after {
    width: 80%;
    transition: width 0.1s linear;
  }

  &.active {
    cursor: default;
    svg {
      fill: ${colors.active_btn};
    }
    &::after {
      width: 80%;
      background-color: ${colors.active_btn};
    }
  }
`;

export default function NavigationBar() {
  const user = auth.currentUser;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [activeContentIndex, setActiveContentIndex] = useState(
    pathname.slice(1)
  );

  const handleLogoutClick = async () => {
    const ok = confirm("로그아웃 하실건가요?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Menu>
      <Link to="/">
        <MenuItem
          className={
            activeContentIndex === "home" || activeContentIndex === ""
              ? "active"
              : ""
          }
          onClick={() => setActiveContentIndex("home")}
        >
          <Icon icon="home" />
        </MenuItem>
      </Link>
      <Link to="/profile">
        <MenuItem
          className={activeContentIndex === "profile" ? "active" : ""}
          onClick={() => setActiveContentIndex("profile")}
        >
          <Icon icon="profile" />
        </MenuItem>
      </Link>
      {user ? (
        <MenuItem onClick={handleLogoutClick} className="log-out">
          <Icon icon="logout" />
        </MenuItem>
      ) : (
        <MenuItem onClick={handleLoginClick} className="log-in">
          <Icon icon="login" />
        </MenuItem>
      )}
    </Menu>
  );
}
