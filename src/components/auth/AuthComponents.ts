import { styled } from "styled-components";
import { colors } from "../../resources/colors";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: 800;
`;

export const Label = styled.label`
  padding-left: 10px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  & svg {
    color: yellow;
    height: 20px;
    margin-right: 5px;
  }
`;

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 5px;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${colors.gray};
  width: 90%;
  font-size: 16px;
  transition: border-color 0.3s linear;
  &:focus {
    box-shadow: none;
    outline: none;
    border-color: ${colors.deep_gray};
  }
`;

export const SubmitInput = styled.input`
  border: none;
  border-radius: 20px;
  background-color: ${colors.deep_gray};
  color: ${colors.background_main};
  margin-top: 20px;
  padding: 10px;
  width: 90%;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const InputErrorText = styled.small`
  padding-left: 30px;
  align-self: flex-start;
  color: tomato;
  font-size: 15px;
  display: flex;
  align-items: center;
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: ${colors.deep_blue};
  }
`;
