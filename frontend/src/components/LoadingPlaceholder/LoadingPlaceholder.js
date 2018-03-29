// @flow
import React from 'react';
import Fade from 'components/Fade';
import Flex from 'shared/components/Flex';
import Mask from './components/Mask';

export default function LoadingPlaceholder(props) {
  return (
    <Fade>
      <Flex column auto {...props}>
        <Mask header />
        <Mask />
        <Mask />
        <Mask />
      </Flex>
    </Fade>
  );
}
