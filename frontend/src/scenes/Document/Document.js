import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import { withRouter, Prompt } from 'react-router-dom';
import keydown from 'react-keydown';

import Flex from 'shared/components/Flex';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import LoadingIndicator from 'components/LoadingIndicator';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import Search from 'scenes/Search';

import {
  collectionUrl,
  updateDocumentUrl,
  documentMoveUrl,
  documentEditUrl,
  matchDocumentEdit,
  matchDocumentMove,
} from 'utils/routeHelpers';

import Actions from './components/Actions';
import DocumentMove from './components/DocumentMove';


const DISCARD_CHANGES = `
You have unsaved changes.
Are you sure you want to discard them?
`;

const propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  documents: PropTypes.object,
  collections: PropTypes.object,
  newDocument: PropTypes.bool,
  ui: PropTypes.object,
};


class DocumentScene extends React.Component {
  savedTimeout = 0
  constructor(props) {
    super(props);
    this.state = {
      editorComponent: undefined,
      editCache: '',
      newDocument: null,
      isLoading: false,
      isSaving: false,
      isPublishing: false,
      notFound: false,
      moveModalOpen: false,
    };
    this.onChange = debounce(this.onChange.bind(this), 300);
  }

  componentWillMount() {
    this.loadDocument(this.props);
    this.loadEditor();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.documentSlug !== this.props.match.params.documentSlug) {
      this.setState({
        notFound: false
      });

      this.loadDocument(nextProps);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.savedTimeout);
    this.props.clearActiveDocument();
  }

  @keydown('m')
  goToMove(ev) {
    ev.preventDefault();

    if (this.document) this.props.history.push(documentMoveUrl(this.document));
  }

  loadDocument = async (props) => {
    if (props.newDocument) {
      const newDocument = {
        // collection: { id: props.match.params.id },
        collectionId: props.match.params.id,
        parent: new URLSearchParams(props.location.search).get('parentDocument'),
        title: '',
        text: ''
      };

      this.setState({
        newDocument
      });
    } else {
      const document = this.getDocument();
      if (document) {
        this.props.setActiveDocument(document);

        // check data if user enters edit mode and cancels
        this.setState({
          editCache: document.text
        });

        if (!this.isEditing && document.publishedAt) {
          this.props.viewedDocument(document);
        }

        // update url to match the current none
        this.props.history.replace(
          updateDocumentUrl(props.match.url, `/doc/${document.slug}`)
        );
      } else {
        // render 404
        this.setState({ notFound: true });
      }
    }
  }

  loadEditor = async () => {
    const EditorImport = await import('components/Editor');
    this.setState({
      editorComponent: EditorImport.default
    });
  }


  get isEditing() {
    return (
      this.props.match.path === matchDocumentEdit || this.props.newDocument
    );
  }

  getDocument() {
    if (this.state.newDocument) return this.state.newDocument;
    let { document } =  this.props;
    if (!document.text) {
      document = this.props.fetchDocument(this.props.match.params.documentSlug);
    }
    return document;
  }

  get document() {
    return this.getDocument();
  }

  handleClearMoveModal = () => this.setState({ moveModalOpen: false })
  handleOpenMoveModal = () => this.setState({ moveModalOpen: true })

  allowSave = document => document.text && document.text.replace(new RegExp('^#$'), '').trim().length === 0

  onSave = async (options) => {
    const { redirect, publish } = options;
    let document = this.props.documentEdit;
    if (!document || this.allowSave(document)) return;

    this.setState({
      editCache: null,
      isSaving: true,
      isPublishing: publish
    });
    document = await this.props.saveDocument(document, publish);
    const documentRes = Object.values(document.documents)[0];

    this.setState({
      isSaving: false,
      isPublishing: false
    });

    if (redirect) {
      this.props.history.push(`/doc/${documentRes.slug}`);
      this.props.setActiveDocument(documentRes);
    } else if (this.props.newDocument) {
      this.props.history.push(documentEditUrl(documentRes));
      this.props.setActiveDocument(documentRes);
    }
  }

  onImageUploadStart = () => {
    this.setState({
      isLoading: true
    });
  }

  onImageUploadStop = () => {
    this.setState({
      isLoading: false,
    });
  }

  onChange(text) {
    const { document } = this;
    if (!document) return null;
    if (document.text.trim() === text.trim()) return null;
    this.props.updateDocumentData(document, { text }, true);
  }

  onDiscard = () => {
    let url;
    if (this.document && this.document.slug) {
      url = `/doc/${this.document.slug}`;
      if (this.state.editCache) this.props.updateDocumentData(document, { text: this.state.editCache });
    } else {
      url = collectionUrl(this.props.match.params.id);
    }

    this.props.history.push(url);
  }

  renderNotFound = () => <Search notFound />

  render() {
    const Editor = this.state.editorComponent;
    const isMoving = this.props.match.path === matchDocumentMove;
    const { document } = this;
    // const { inputRef } = this.props;
    // inputRef={inputRef} 传递给Editor获取Editor ref跨越组件通信

    // const titleText = get(document, 'title', '') || this.props.titleForDocument(this.props.location.pathname);
    const titleText = get(document, 'title', '');
    if (this.state.notFound) {
      return this.renderNotFound();
    }
    const { hasPendingChanges } = this.props.status;


    return (
      <Container key={this.props.location.pathname} column auto>
        { isMoving && document && <DocumentMove document={document} />}
        { titleText && <PageTitle title={titleText} />}
        { (this.state.isLoading || this.state.isSaving) && <LoadingIndicator />}
        { !document && !Editor ? (
          <CenteredContent>
            <LoadingState />
          </CenteredContent>
        ) : (
          <Flex justify="center" auto>
            {
              this.isEditing && (
                <Prompt
                  when={hasPendingChanges}
                  message={DISCARD_CHANGES}
                />
              )
            }

            {
              Editor &&
              <Editor
                text={document.text}
                emoji={document.emoji}
                onImageUploadStart={this.onImageUploadStart}
                onImageUploadStop={this.onImageUploadStop}
                onChange={this.onChange}
                onSave={this.onSave}
                onCancel={this.onDiscard}
                readOnly={!this.isEditing}
              />
            }
            {
              document && (
                <Actions
                  document={document}
                  isDraft={!document.publishedAt}
                  isEditing={this.isEditing}
                  isSaving={this.state.isSaving}
                  isPublishing={this.state.isPublishing}
                  savingInDisabled={this.allowSave(document)}
                  history={this.props.history}
                  onDiscard={this.onDiscard}
                  onSave={this.onSave}
                />
              )
            }
          </Flex>
        )}
      </Container>
    );
  }
}


const Container = styled(Flex)`
  position: relative;
`;

const LoadingState = styled(LoadingPlaceholder)`
  margin: 90px 0;
`;

export default withRouter(DocumentScene);
