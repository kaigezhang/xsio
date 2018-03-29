// @flow
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';
import { UserAvatar } from 'components/Avatar'
import TeamLogo from './TeamLogo';


const propTypes = {
  teamName: PropTypes.string,
  subheading : PropTypes.string,
  logoUrl : PropTypes.string,
};

function HeaderBlock({ username, teamName, subheading, logoUrl, ...rest }) {
  return (
    <Header justify="flex-start" align="center" {...rest}>
      <UserAvatar name={username} size={40} />
      <Flex align="flex-start" column>
        <TeamName>{teamName}</TeamName>
        <Subheading>{subheading}</Subheading>
      </Flex>
    </Header>
  );
}

const Subheading = styled.div`
  padding-left: 10px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 500;
  color: ${color.slateDark};
`;

const TeamName = styled.div`
  padding-left: 10px;
  font-weight: 600;
  color: ${color.text};
  text-decoration: none;
  font-size: 16px;
`;

const Header = styled(Flex)`
  flex-shrink: 0;
  padding: 16px 24px;
  position: relative;
  cursor: pointer;
  width: 100%;

  &:active,
  &:hover {
    transition: background 100ms ease-in-out;
    background: rgba(0, 0, 0, 0.05);
  }
`;

export default HeaderBlock;
