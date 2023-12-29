import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import styled from "styled-components";
import { colors } from "../../resources/colors";
import Icon from "../../resources/icons";

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

  &:hover::after {
    width: 80%;
    transition: width 0.1s linear;
  }
`;

export default function NavigationBar() {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    const ok = confirm("로그아웃 하실건가요?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };

  return (
    <Menu>
      <Link to="/">
        <MenuItem>
          <Icon icon="home" />
        </MenuItem>
      </Link>
      <Link to="/profile">
        <MenuItem>
          <Icon icon="profile" />
        </MenuItem>
      </Link>
      <MenuItem onClick={handleLogoutClick} className="log-out">
        <Icon icon="logout" />
      </MenuItem>
    </Menu>
  );
}
