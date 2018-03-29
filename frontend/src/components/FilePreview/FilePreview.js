import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { color } from 'shared/styles/constants';
import Highlight from 'components/Highlight';
import Flex from 'shared/components/Flex';
import StarredIcon from 'components/Icon/StarredIcon';
import FileMenu from 'menus/FileMenu';
import PublishingInfo from './components/PublishingInfo';

const propTypes = {
  fileRef: PropTypes.object,
  highlight: PropTypes.string,
  showLibrary: PropTypes.bool,
  innerRef: PropTypes.func,
  /* TODO 需要改成pin 大头针形式 */
  pinFile: PropTypes.func,
  unPinFile: PropTypes.func,
};

const defaultProps = {
  highlight: '',
  showLibrary: false
};

class FilePreview extends Component {
  render() {
    const {
      fileRef,
      highlight,
      showLibrary,
      innerRef,
      pinFile,
      unPinFile,
      ...rest
    } = this.props;
    console.log(fileRef, 'file preview')
    let fileTitle = fileRef.title || fileRef.name;
    fileTitle = `${fileTitle.slice(0, 90)}...`
    return (
      <FileLink to={`/files/${fileRef.id}`} innerRef={innerRef} {...rest}>
        <Heading>
          <Highlight text={fileTitle} highilght={highlight} />
          <StyledFileMenu file={fileRef} />

        </Heading>
        <PublishingInfo
          file={fileRef}
          library={showLibrary ? fileRef.library : undefined}
        />
      </FileLink>
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

const StyledFileMenu = styled(FileMenu)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
`;


const FileLink = styled(Link)`
  display: block;
  margin: 0 -16px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  max-height: 50vh;
  min-width: 100%;
  overflow: hidden;
  position: relative;

  ${StyledFileMenu} {
    opacity: 0;
  }

  &:hover,
  &:active,
  &:focus {
    background: ${color.smokeLight};
    border: 2px solid ${color.smoke};
    outline: none;

    ${StyledStar}, ${StyledFileMenu} {
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


const Heading = styled.h5`
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


FilePreview.propTypes = {};

export default FilePreview;
