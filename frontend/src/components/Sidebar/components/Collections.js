// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Flex from 'shared/components/Flex';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

import DropToImport from 'components/DropToImport';
import PlusIcon from 'components/Icon/PlusIcon';
import CollectionIcon from 'components/Icon/CollectionIcon';
import CollectionMenu from 'menus/CollectionMenu';

import Header from './Header';
import SidebarLink from './SidebarLink';


/* 所有原始来自于store的都可以便曾reducer和他对应的action */
const collectionsPropTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  //
  collections : PropTypes.array,
  onCreateCollection : PropTypes.func,
  ui : PropTypes.object,
};


const Collections = (props) => {
  const { history, location, collections, ui, prefetchDocument, onCreateCollection } = props;
  return (
    <Flex column>
      <Header>Collections</Header>
      {collections.length > 0 && collections.map(collection => (
        <CollectionLink
          key={collection.id}
          history={history}
          location={location}
          collection={collection}
          activeDocument={ui.activeDocument}
          prefetchDocument={prefetchDocument}
          ui={ui}
        />
      ))}

      <SidebarLink
        onClick={onCreateCollection}
        icon={<PlusIcon />}
      >
        New collection…
      </SidebarLink>
    </Flex>
  );
};


const collectionLinkPropTypes = {
  history: PropTypes.object,
  collection: PropTypes.object,
  ui: PropTypes.object,
  activeDocument: PropTypes.object,
  prefetchDocument: PropTypes.func,
};


class CollectionLink extends Component {
  state = {
    menuOpen: false
  }

  renderDocuments() {
    const {
      history,
      collection,
      activeDocument,
      prefetchDocument,
    } = this.props;
    return (
      <CollectionChildren column>
        {collection.documents.map(document => (
          <DocumentLink
            key={document.id}
            history={history}
            document={document}
            activeDocument={activeDocument}
            prefetchDocument={prefetchDocument}
            depth={0}
          />
        ))}
      </CollectionChildren>
    );
  }

  render() {
    const { history, collection, ui } = this.props;

    const activeCollectionId = ui.activeCollection ? ui.activeCollection.id : null;
    const expanded = collection.id === activeCollectionId;

    return (
      <StyledDropToImport
        key={collection.id}
        history={history}
        collectionId={collection.id}
        activeClassName="activeDropZone"
        menuOpen={this.state.menuOpen}
      >
        <SidebarLink
          key={collection.id}
          to={`/collections/${collection.id}`}
          icon={<CollectionIcon expanded={expanded} color={collection.color} />}
          iconColor={collection.color}
          expandedContent={this.renderDocuments()}
          hideExpandToggle
          expand={expanded}
        >
          <CollectionName justify="space-between">
            {collection.name}
          </CollectionName>
        </SidebarLink>
        <CollectionAction>
          <CollectionMenu
            history={history}
            collection={collection}
            onOpen={() => (this.setState({ menuOpen: true }))}
            onClose={() => (this.setState({ menuOpen: true }))}
          />
        </CollectionAction>
      </StyledDropToImport>
    );
  }
}

// type DocumentLinkProps = {
//   document: NavigationNode,
//   history: Object,
//   activeDocument: ?Document,
//   activeDocumentRef: HTMLElement => void,
//   prefetchDocument: (documentId: string) => void,
//   depth: number,
// };


const documentLinkPropTypes = {
  document: PropTypes.object,
  history: PropTypes.object,
  activeDocument: PropTypes.object,
  activeDocumentRef: PropTypes.func,
  prefetchDocument: PropTypes.func,
  depth: PropTypes.number,
};


const DocumentLink = (({
  document,
  activeDocument,
  activeDocumentRef,
  prefetchDocument,
  depth,
  history,
}) => {
  const isActiveDocument =
      activeDocument && activeDocument.id === document.id;
  // const showChildren = !!(
  //   activeDocument &&
  //     (activeDocument.pathToDocument.map(entry => entry.id).includes(document.id) || isActiveDocument)
  // );
  const showChildren = true;

  const handleMouseEnter = (event) => {
    event.stopPropagation();
    event.preventDefault();
    prefetchDocument(document.id);
  };

  return (
    <Flex
      column
      key={document.id}
      innerRef={isActiveDocument ? activeDocumentRef : undefined}
      onMouseEnter={handleMouseEnter}
    >
      <DropToImport
        history={history}
        documentId={document.id}
        activeClassName="activeDropZone"
      >
        <SidebarLink
          to={`/doc/${document.slug}`}
          expand={showChildren}
          expandedContent={
            document.children.length ? (
              <DocumentChildren column>
                {document.children.map(childDocument => (
                  <DocumentLink
                    key={childDocument.id}
                    history={history}
                    document={childDocument}
                    activeDocument={activeDocument}
                    prefetchDocument={prefetchDocument}
                    depth={depth + 1}
                  />
                ))}
              </DocumentChildren>
            ) : (
              undefined
            )
          }
        >
          {document.title}
        </SidebarLink>
      </DropToImport>
    </Flex>
  );
}
);

const CollectionName = styled(Flex)`
  padding: 0 0 4px;
`;

const CollectionAction = styled.span`
  position: absolute;
  right: 0;
  top: 0;
  color: ${color.slate};
  svg {
    opacity: 0.75;
  }

  &:hover {
    svg {
      opacity: 1;
    }
  }
`;

const StyledDropToImport = styled(DropToImport)`
  position: relative;

  ${CollectionAction} {
    display: ${props => (props.menuOpen ? 'inline' : 'none')};
  }

  &:hover {
    ${CollectionAction} {
      display: inline;
    }
  }
`;

const CollectionChildren = styled(Flex)`
  margin-top: -4px;
  margin-left: 36px;
  padding-bottom: 4px;
`;

const DocumentChildren = styled(Flex)`
  margin-top: -4px;
  margin-left: 12px;
`;

export default Collections;
