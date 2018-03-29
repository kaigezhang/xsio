import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import { newDocumentUrl } from 'utils/routeHelpers';

import Search from 'scenes/Search';
import CollectionMenu from 'menus/CollectionMenu';
import Actions, { Action, Separator } from 'components/Actions';
import CenteredContent from 'components/CenteredContent';
import CollectionIcon from 'components/Icon/CollectionIcon';
import NewDocumentIcon from 'components/Icon/NewDocumentIcon';
import PinIcon from 'components/Icon/PinIcon';
import { ListPlaceholder } from 'components/LoadingPlaceholder';
import Button from 'components/Button';
import HelpText from 'components/HelpText';
import DocumentList from 'components/DocumentList';
import Subheading from 'components/Subheading';
import PageTitle from 'components/PageTitle';
import Flex from 'shared/components/Flex';


const propTypes = {
  ui: PropTypes.object,
  documents: PropTypes.object,
  collections: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  pinnedDocuments: PropTypes.array,
  getPinnedDocuments: PropTypes.func,
};


class CollectionScene extends Component {
  state = {
    collection: null,
    isFetching: false,
  }

  componentWillMount() {
    this.loadContent(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.loadContent(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.clearActiveCollection();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.collection !== this.props.collection;
  }

  loadContent = async (props) => {
    this.setState({ isFetching: true });
    const { collection } = props;
    if (collection) {
      this.setState({
        collection
      }, () => {
        this.props.setActiveCollection(collection);
        this.setState({ isFetching: false });
      });
    }
  }

  onNewDocument = (ev) => {
    ev.preventDefault();

    if (this.state.collection) {
      this.props.history.push(`/collections/${this.state.collection.id}/new`);
    }
  }

  renderActions = () => (
    <Actions align="center" justify="flex-end">
      <Action>
        <CollectionMenu
          history={this.props.history}
          collection={this.state.collection}
        />
        <Separator />
        <Action>
          <a onClick={this.onNewDocument}>
            <NewDocumentIcon />
          </a>
        </Action>
      </Action>
    </Actions>
  )

  renderEmptyCollection = collection => (
    <CenteredContent>
      <PageTitle title={collection.name} />
      <Heading>
        <CollectionIcon color={collection.color} size={40} expanded />{' '}
        { collection.name }
      </Heading>
      <HelpText>
          写一篇文章开启这个收藏夹
      </HelpText>
      <Wrapper>
        <Link to={newDocumentUrl(collection)}>
          <Button>Create new document</Button>
        </Link>
      </Wrapper>
      { this.renderActions() }
    </CenteredContent>
  )

  renderNotFound = () => (<Search notFound />)

  render() {
    const { collection, isFetching } = this.state;
    if (!isFetching && !collection) {
      return this.renderNotFound();
    }

    if (collection && collection.documents && collection.documents.length === 0) {
      return this.renderEmptyCollection(collection);
    }

    const { pinnedDocuments, recentlyEditedDocuments } = this.props;

    console.log(pinnedDocuments, recentlyEditedDocuments, 'pinned recent');
    return (
      <CenteredContent>
        { collection ? (
          <React.Fragment>
            <PageTitle title={collection.name} />
            <Heading>
              <CollectionIcon
                color={collection.color}
                size={40}
                expanded
              /> {' '}
              {collection.name }
            </Heading>

            {
              pinnedDocuments.length > 0 && (
                <React.Fragment>
                  <Subheading>
                    <TinyPinIcon size={18} /> Pinned
                  </Subheading>
                  <DocumentList documents={pinnedDocuments} />
                </React.Fragment>
              )
            }
            <Subheading>Recently edited</Subheading>
            <DocumentList documents={recentlyEditedDocuments} limit={10} />
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

export default withRouter(CollectionScene);
