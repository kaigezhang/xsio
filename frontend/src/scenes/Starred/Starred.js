import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CenteredContent from 'components/CenteredContent';
import { ListPlaceholder } from 'components/LoadingPlaceholder';
import Empty from 'components/Empty';
import PageTitle from 'components/PageTitle';
import DocumentList from 'components/DocumentList';

const propTypes = {
  fetchStarredDocuments: PropTypes.func,
  isFetching: PropTypes.bool,
  isLoaded: PropTypes.bool,
  starred: PropTypes.array,
  status: PropTypes.object,
};


class Starred extends Component {
  componentDidMount() {
    this.props.fetchStarredDocuments();
  }

  render() {
    const { status, starred } = this.props;
    const { isLoaded, isFetching } = status;

    const showLoading = !isLoaded && isFetching;
    const showEmpty = isLoaded && !starred.length;

    return (
      <CenteredContent column auto>
        <PageTitle title="Starred" />
        <h1>Starred</h1>
        {showLoading && <ListPlaceholder />}
        {showEmpty && <Empty>No starred documents yet.</Empty>}
        <DocumentList documents={starred} />
      </CenteredContent>
    );
  }
}

export default Starred;
