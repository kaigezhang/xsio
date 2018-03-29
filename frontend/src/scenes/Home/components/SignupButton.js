import React from 'react';
import styled from 'styled-components';
import { signin } from 'shared/utils/routeHelpers';
import { color } from 'shared/styles/constants';

const SignupButton = () => (
  <Button href={signin()}>
    <Spacer>登录或注册</Spacer>
  </Button>
);

const Spacer = styled.span`
  padding-left: 10px;
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  color: ${color.white};
  background: ${color.black};
  border-radius: 4px;
  font-weight: 600;
`;

export default SignupButton;
