import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';
import Highlight from 'components/Highlight';
import StarredIcon from 'components/Icon/StarredIcon';
import DocumentMenu from 'menus/DocumentMenu';
import PublishingInfo from './components/PublishingInfo';

const propTypes = {
  document: PropTypes.object,
  highlight: PropTypes.string,
  showCollection: PropTypes.bool,
  innerRef: PropTypes.func,
  starDocument: PropTypes.func,
  unstarDocument: PropTypes.func,
};

const defaultProps = {
  highlight: '',
  showCollection: false
}


class DocumentPreview extends Component {
  start = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.starDocument(this.props.document.id);
  }

  unstar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.unstarDocument(this.props.document.id);
  }

  render() {
    const {
      documentRef,
      showCollection,
      innerRef,
      highlight,
      starDocument,
      unstarDocument,
      ...rest
    } = this.props;

    return (
      <DocumentLink to={`/doc/${documentRef.slug}`} innerRef={innerRef} {...rest}>
        <Heading>
          <Highlight text={documentRef.title} highlight={highlight} />
          {
            documentRef.publishedAt && (
              <Actions>
                {
                  documentRef.starred ? (
                    <StyledStar onClick={this.unstar} />
                  ) : (
                    <StyledStar onClick={this.star} />
                  )
                }
              </Actions>
            )
          }
          <StyledDocumentMenu document={documentRef} />
        </Heading>
        <PublishingInfo
          document={documentRef}
          collection={showCollection ? documentRef.collection : undefined}
        />
      </DocumentLink>
    );
  }
}


const StyledStar = styled(({ solid, ...props }) => (
  <StarredIcon color={solid ? color.black : color.text} {...props} />
))`
  opacity: ${props => (props.solid ? '1 !important' : 0)};
  transition: all 100ms ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;


const StyledDocumentMenu = styled(DocumentMenu)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
`;

const DocumentLink = styled(Link)`
  display: block;
  margin: 0 -16px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  max-height: 50vh;
  min-width: 100%;
  overflow: hidden;
  position: relative;

  ${StyledDocumentMenu} {
    opacity: 0;
  }

  &:hover,
  &:active,
  &:focus {
    background: ${color.smokeLight};
    border: 2px solid ${color.smoke};
    outline: none;

    ${StyledStar}, ${StyledDocumentMenu} {
      opacity: 0.5;

      &:hover {
        opacity: 1;
      }
    }
  }
  &:focus {
    border: 2px solid ${color.slateDark};
  }
`;


const Heading = styled.h3`
  display: flex;
  align-items: center;
  height: 24px;
  margin-top: 0;
  margin-bottom: 0.25em;
`;

const Actions = styled(Flex)`
  margin-left: 4px;
  align-items: center;
`;


export default DocumentPreview;
