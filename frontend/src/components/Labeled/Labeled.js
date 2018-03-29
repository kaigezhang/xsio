// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'shared/components/Flex';
import styled from 'styled-components';
import { size } from 'shared/styles/constants';

const propTypes = {
  label: PropTypes.oneOf([
    PropTypes.node,
    PropTypes.string
  ]),
  children: PropTypes.node,
};

const Labeled = ({ label, children, ...props }) => (
  <Flex column {...props}>
    <Label>{label}</Label>
    {children}
  </Flex>
);

export const Label = styled(Flex)`
  margin-bottom: ${size.medium};
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  color: #9fa6ab;
  letter-spacing: 0.04em;
`;

export default Labeled;
