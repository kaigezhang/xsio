import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CenteredContent from 'components/CenteredContent';
import { ListPlaceholder } from 'components/LoadingPlaceholder';
import Empty from 'components/Empty';
import PageTitle from 'components/PageTitle';
import DocumentList from 'components/DocumentList';

const propTypes = {
  status: PropTypes.object,
  getDraftsDocuments: PropTypes.func,
  drafts: PropTypes.array,
};

class Drafts extends Component {
  componentDidMount() {
    this.props.getDraftsDocuments();
  }

  render() {
    const { status, drafts } = this.props;
    const { isLoaded, isFetching } = status;

    const showLoading = !isLoaded && isFetching;
    const showEmpty = isLoaded && !drafts.length;

    return (
      <CenteredContent>
        <PageTitle title="drafts" />
        { showLoading && <ListPlaceholder />}
        { showEmpty && <Empty>No drafts yet.</Empty>}
        <DocumentList documents={drafts} showCollection />
      </CenteredContent>
    );
  }
}

export default Drafts;
