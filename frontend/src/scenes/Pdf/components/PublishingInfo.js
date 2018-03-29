// @flow
import React, { Component } from 'react';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import styled from 'styled-components';
import { UserAvatar } from 'components/Avatar';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';

const PublishingInfo = ({
  user,
  highlight
}) => {
  const timeAgo = `${distanceInWordsToNow(new Date(highlight.createdAt))} ago`;
  return (
    <Card>
      <Header>
        {
          highlight.selectors.textQuote ? (
            <blockquote>
              {`${highlight.selectors.textQuote.content.slice(0, 90).trim()}......`}
            </blockquote>
          ) : null
        }

        {
          highlight.selectors.image ? (
            <img src={highlight.selectors.image} alt="" />
            /* <span style={{ backgroundImage: `url("${highlight.selectors.image}")` }} /> */
            /* <StyledSpan image={highlight.selectors.image} /> */
          ) : null}
      </Header>
      <Content>
        <Container align="center">
          <UserAvatar name={highlight.author.username} size={30} />
          <span>{' '}created {timeAgo}</span>
        </Container>
        <Comment>
          {highlight.comment}
        </Comment>

      </Content>
    </Card>
  );
};

const Container = styled(Flex)`
  color: ${color.slate};
  font-size: 13px;
  margin: 3px 0;
  span {
    margin-left: 4px;
  }
`;

const Card = styled.div`
  display: block;
  background: ${color.smokeLight};
  border: 2px solid transparent;
  box-shadow: 1px 1px 20px ${color.smokeDark}, 1px 1px 30px ${color.smokeLight}
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background 140ms ease-in;
  &:hover,
  &:active,
  &:focus {
    background: ${color.smokeLight};
    border: 2px solid ${color.smoke};
    outline: none;
  }
  &:focus {
    border: 2px solid ${color.slateDark};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  max-height: 100px;
  margin-top: 0;
  margin-bottom: 0.25em;
  border: 1px solid ${color.smokeDark};
  border-radius: 5px;
  background: ${color.smokeLight};
  blockquote {
    border-left: 3px solid #efefef;
    margin: 1.2em 0;
    padding-left: 20px;
    font-style: italic;
  }
  img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    //justify-content: center;
  }
`;
const Content = styled.div`
  margin: 6px 12px;
`;

const Comment = styled.div`
  margin-left: 4px;
  color: ${color.text};
  font-size: 16px;
`;

export default PublishingInfo;
