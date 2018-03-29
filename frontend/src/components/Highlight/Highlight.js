// @flow
import React from 'react';
import PropTypes from 'prop-types';
import replace from 'string-replace-to-array';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

const propTypes = {
  highlight: PropTypes.string,
  text: PropTypes.string,
  caseSensitive: PropTypes.boolean,
};

function Highlight({
  highlight,
  caseSensitive,
  text,
  ...rest
}) {
  return (
    <span {...rest}>
      {highlight
        ? replace(text, new RegExp((highlight || '').replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&'), caseSensitive
          ? 'g'
          : 'gi'), (tag, index) => <Mark key={index}>{tag}</Mark>
        )
        : text}
    </span>
  );
}

const Mark = styled.mark`
  background: ${color.yellow};
`;

export default Highlight;
