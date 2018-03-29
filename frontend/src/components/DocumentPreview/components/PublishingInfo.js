// @flow
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
  collection: PropTypes.object,
  document: PropTypes.object,
  views: PropTypes.number,
};

const  PublishingInfo = (props) => {
  const { collection, document } = props;
  const {
    modifiedSinceViewed,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    publishedAt,
  } = document;

  const timeAgo = `${distanceInWordsToNow(new Date(createdAt))} ago`;

  return (
    <Container align="center">
      {publishedAt === updatedAt ? (
        <span>
          {createdBy.name} published {timeAgo}
        </span>
      ) : (
        <React.Fragment>
          {updatedBy.name}
          {publishedAt ? (
            <Modified highlight={modifiedSinceViewed}>
              &nbsp;modified {timeAgo}
            </Modified>
          ) : (
            <span>&nbsp;saved {timeAgo}</span>
          )}
        </React.Fragment>
      )}
      {collection && (
        <span>
            &nbsp;in <strong>{collection.name}</strong>
        </span>
      )}
    </Container>
  );
};

export default PublishingInfo;
