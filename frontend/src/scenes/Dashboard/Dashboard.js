import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import CenteredContent from 'components/CenteredContent';
import DocumentList from 'components/DocumentList';
import FileList from 'components/FileList';
import PageTitle from 'components/PageTitle';
import Subheading from 'components/Subheading';
import { ListPlaceholder } from 'components/LoadingPlaceholder';

const propTypes = {
  // getRecentlyEdited: PropTypes.func,
  getCollections: PropTypes.func,
  getLibraries: PropTypes.func,
};

class Dashboard extends Component {
  state = {
    isLoaded: false
  }

  componentWillMount() {
    this.loadContent();
  }

  loadContent = async () => {
    await Promise.all([
      this.props.getCollections(),
      this.props.getLibraries(),
    ]).then(() => this.setState({
      isLoaded: true
    }));
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) return null;
    const { recentlyEdited, recentlyFiles } = this.props;
    const hasRecentlyEdited = recentlyEdited.length > 0;

    const hasRecentlyFiles = recentlyFiles.length > 0;

    const showContent = isLoaded || hasRecentlyEdited || hasRecentlyFiles;
    return (
      <CenteredContent>
        <PageTitle title="home" />
        <h1>Home</h1>
        {
          showContent ? (
            <span>
              {
                hasRecentlyEdited && [
                  <Subheading key="edited">Recently edited</Subheading>,
                  <DocumentList
                    key="editedDocuments"
                    documents={recentlyEdited}
                    limit={5}
                  />
                ]
              }
              {
                hasRecentlyFiles && [
                  <Subheading key="files">Recently Files</Subheading>,
                  <FileList
                    key="recentlyFiles"
                    files={recentlyFiles}
                    limit={5}
                  />
                ]
              }
            </span>
          ) : (
            <ListPlaceholder count={5} />
          )
        }
      </CenteredContent>
    );
  }
}


Dashboard.propTypes = propTypes;

export default Dashboard;
