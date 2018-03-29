// @flow
import React from 'react';
import times from 'lodash/times';
import styled from 'styled-components';
import Fade from 'components/Fade';
import Flex from 'shared/components/Flex';
import Mask from './components/Mask';

const ListPlaceHolder = ({ count }) => (
  <Fade>
    {times(count || 2, index => (
      <Item key={index} column auto>
        <Mask header />
        <Mask />
      </Item>
    ))}
  </Fade>
);

const Item = styled(Flex)`
  padding: 18px 0;
`;

export default ListPlaceHolder;
