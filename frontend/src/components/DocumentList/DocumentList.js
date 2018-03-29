import React from 'react';
import PropTypes from 'prop-types';
import DocumentPreview from 'components/DocumentPreview';
import ArrowKeyNavigation from 'boundless-arrow-key-navigation';


const propTypes = {
  documents: PropTypes.array,
  showCollection: PropTypes.bool,
  limit: PropTypes.number,
};

const DocumentList = ({
  documents,
  limit,
  showCollection
}) => {
  const documentsProps = documents || [];
  const documentsToShow = limit ? documentsProps.splice(0, limit) : documentsProps;

  return (
    <ArrowKeyNavigation
      mode={ArrowKeyNavigation.mode.VERTICAL}
      defaultActiveChildIndex={0}
    >
      {
        documentsToShow.map(document => (
          <DocumentPreview
            key={document}
            document={document}
            showCollection={showCollection}
          />
        ))
      }
    </ArrowKeyNavigation>
  );
};

DocumentList.propTypes = propTypes;

export default DocumentList;
