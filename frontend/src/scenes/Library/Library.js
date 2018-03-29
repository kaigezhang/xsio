import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import { newLibraryUrl } from 'utils/routeHelpers';

import Search from 'scenes/Search';
import LibraryMenu from 'menus/LibraryMenu';
import Actions, { Action, Separator } from 'components/Actions';
import CenteredContent from 'components/CenteredContent';
import CollectionIcon from 'components/Icon/CollectionIcon';
import NewDocumentIcon from 'components/Icon/NewDocumentIcon';
import PinIcon from 'components/Icon/PinIcon';
import { ListPlaceholder } from 'components/LoadingPlaceholder';
import Button from 'components/Button';
import HelpText from 'components/HelpText';
import FileList from 'components/FileList';
import Subheading from 'components/Subheading';
import PageTitle from 'components/PageTitle';
import Flex from 'shared/components/Flex';

import getDataTransferFiles from 'utils/getDataTransferFiles';

const propTypes = {
  ui: PropTypes.object,
  libraries: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.project,
  pinnedFiles: PropTypes.array,
  getPinnedFiles: PropTypes.func,
};

class LibraryScene extends Component {
  state = {
    library: null,
    isFetching: false
  }

  componentWillMount() {
    this.loadContent(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.loadContent(nextProps);
    }
  }
  shouldComponentUpdate(nextProps) {
    return this.props.library !== nextProps.library;
  }

  componentWillUnmount() {
    this.props.clearActiveLibrary();
  }
  componentDidUpdate() {
    this.render();
  }

  loadContent = (props) => {
    this.setState({ isFetching: true });
    const { library } = props;
    if (library) {
      this.setState({
        library
      }, () => {
        props.setActiveLibrary(library);
        this.setState({ isFetching: false });
      });
    }
  }

  onNewFile = (ev) => {
    ev.preventDefault();

    // simulate a click on the file upload input element
    this.files.click();
  }

  onFilePicked = async (ev) => {
    const files = getDataTransferFiles(ev);
    console.log(this.state.library.id, 'libraryid');
    await this.props.uploadFile({
      files,
      libraryId: this.state.library.id,
    });
  };

  renderActions = () => (
    <Actions align="center" justify="flex-end">
      <Action>
        <LibraryMenu
          history={this.props.history}
          library={this.state.library}
        />
        <Separator />
        <Action>
          <a onClick={this.onNewFile}>
            <NewDocumentIcon />
          </a>
          <HiddenInput
            type="file"
            innerRef={ref => (this.files = ref)}
            onChange={this.onFilePicked}
            accept="application/pdf"
            multiple="multiple"
          />
        </Action>
      </Action>
    </Actions>
  )

  renderEmptyLibrary = library => (
    <CenteredContent>
      <PageTitle title={library.name} />
      <Heading>
        <CollectionIcon color={library.color} size={40} expanded />{' '}
        { library.name }
      </Heading>
      <HelpText>上传一篇文章创建自己的文件夹</HelpText>
      <Wrapper>
        <Button onClick={this.onNewFile}>点击上传</Button>
      </Wrapper>

      { this.renderActions() }
    </CenteredContent>
  )

  renderNotFound = () => (<Search notFound />)
  render() {
    const { pinnedFiles, recentlyFiles } = this.props;
    const { library, isFetching } = this.state;
    console.log(library, pinnedFiles, recentlyFiles, 'pinned recently');
    if (!isFetching && !library) {
      return this.renderNotFound();
    }
    const showPinnedFiles = pinnedFiles.length > 0;
    const showRecentlyFiles = recentlyFiles.length > 0;
    if (library && library.files && library.files.length === 0 && !showPinnedFiles && !showRecentlyFiles) {
      return this.renderEmptyLibrary(library);
    }

    return (
      <CenteredContent>
        {
          library ? (
            <React.Fragment>
              <PageTitle title={library.name} />
              <Heading>
                <CollectionIcon
                  color={library.color}
                  size={40}
                  expanded
                />{' '}{ library.name }
              </Heading>
              {
                showPinnedFiles && (
                  <React.Fragment>
                    <Subheading>
                      <TinyPinIcon size={18} /> Pinned
                    </Subheading>
                    <FileList files={pinnedFiles} />
                  </React.Fragment>
                )
              }
              {
                showRecentlyFiles && (
                  <React.Fragment>
                    <Subheading>Recently Edited</Subheading>
                    <FileList files={recentlyFiles} limit={10} />
                  </React.Fragment>
                )
              }
              { this.renderActions() }
            </React.Fragment>
          ) : (
            <ListPlaceholder count={5} />
          )
        }
      </CenteredContent>
    );
  }
}


const HiddenInput = styled.input`
  position: absolute;
  top: -100px;
  left: -100px;
  visibility: hidden;
`;

const TinyPinIcon = styled(PinIcon)`
  position: relative;
  top: 4px;
  opacity: 0.8;
`;

const Heading = styled.h1`
  display: flex;

  svg {
    margin-left: -6px;
    margin-right: 6px;
  }
`;

const Wrapper = styled(Flex)`
  margin: 10px 0;
`;

export default withRouter(LibraryScene);
