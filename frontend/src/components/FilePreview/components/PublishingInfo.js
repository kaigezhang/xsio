import React, { Component } from 'react';
import PropTypes from 'prop-types';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';

const Container = styled(Flex)`
  color: ${color.slate};
  font-size: 13px;
`;

const Modified = styled.span`
  color: ${props => (props.highlight ? color.slateDark : color.slate)};
  font-weight: ${props => (props.highlight ? '600' : '400')};
`;

const propTypes = {
  library: PropTypes.object,
  file: PropTypes.object,
  views: PropTypes.number
};

const PublishingInfo = (props) => {
  const { library, file } = props;
  const {
    createdAt,
    updatedAt,
  } = file;
  const timeAgo = `${distanceInWordsToNow(new Date(createdAt))} ago`;

  return (
    <Container align="center">
      {
        createdAt ? (
          <span>
            uploaded { timeAgo}
          </span>
        ) : null
      }
      {
        library && (
          <span>
            &nbsp;in <strong>{library.name}</strong>
          </span>
        )
      }
    </Container>
  );
};


export default PublishingInfo
