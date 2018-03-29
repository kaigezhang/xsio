import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilePreview from 'components/FilePreview';
import ArrowKeyNavigation from 'boundless-arrow-key-navigation';


const propTypes = {
  files: PropTypes.array,
  showLibrary: PropTypes.bool,
  limit: PropTypes.number,
};

const FileList = ({
  files,
  limit,
  showLibrary
}) => {
  const filesProps = files || [];
  const filesToShow = limit ? filesProps.splice(0, limit) : filesProps;

  return (
    <ArrowKeyNavigation
      mode={ArrowKeyNavigation.mode.VERTICAL}
      defaultActiveChildIndex={0}
    >
      {
        filesToShow.map(file => (
          <FilePreview
            key={file}
            file={file}
            showLibrary={showLibrary}
          />
        ))
      }
    </ArrowKeyNavigation>
  );
};

FileList.propTypes = propTypes;

export default FileList;
