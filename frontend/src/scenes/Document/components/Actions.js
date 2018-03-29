import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

import { documentEditUrl, documentNewUrl } from 'utils/routeHelpers';

import DocumentMenu from 'menus/DocumentMenu';
import Collaborators from 'components/Collaborators';
import NewDocumentIcon from 'components/Icon/NewDocumentIcon';
import Actions, { Action, Separator } from 'components/Actions';


const propTypes = {
  document: PropTypes.object,
  isDraft: PropTypes.bool,
  isEditing: PropTypes.bool,
  isSaving: PropTypes.bool,
  isPublishing: PropTypes.bool,
  savingIsDisabled: PropTypes.bool,
  onDiscard: PropTypes.objectOf({
    redirect: PropTypes.bool,
    publish: PropTypes.bool,
  }),
  onSave: PropTypes.bool,
  history: PropTypes.bool,
};


class DocumentActions extends Component {
  handleNewDocument = () => this.props.history.push(documentNewUrl(this.props.document));
  handleEdit = () => this.props.history.push(documentEditUrl(this.props.document));
  handleSave = () => this.props.onSave({ redirect: true });
  handlePublish = () => this.props.onSave({ redirect: true, publish: true });
  render() {
    const {
      document,
      isEditing,
      isDraft,
      isPublishing,
      isSaving,
      savingIsDisabled,
    } = this.props;

    return (
      <Actions align="center" justify="flex-end" readonly={!isEditing}>
        {!isDraft && !isEditing && <Collaborators document={document} />}
        { isDraft && (
          <Action>
            <Link
              onClick={this.handlePublish}
              title="Publish document (cmd+enter)"
              disabled={savingIsDisabled}
              highlight
            >
              { isPublishing ? 'publishing...' : 'Publish'}
            </Link>
          </Action>
        ) }
        { isEditing && (
          <React.Fragment>
            <Action>
              <Link
                onClick={this.handleSave}
                title="Save changes (Cmd + enter)"
                disabled={savingIsDisabled}
                isSaving={isSaving}
                highlight={!isDraft}
              >

                { isSaving && !isPublishing ? 'Saving...' : 'Save'}
              </Link>
            </Action>
            { isDraft && <Separator />}
          </React.Fragment>
        ) }
        { !isEditing && (
          <Action>
            <a onClick={this.handleEdit}>Edit</a>
          </Action>
        ) }
        { isEditing && (
          <Action>
            <a onClick={this.props.onDiscard}>
              { document.hasPendingDiscard ? 'Discard' : 'Done'}
            </a>
          </Action>
        ) }
        { !isEditing && (
          <Action>
            <DocumentMenu document={document} />
          </Action>
        ) }
        { !isEditing && !isDraft && (
          <React.Fragment>
            <Separator />
            <Action>
              <a onClick={this.handleNewDocument}>
                <NewDocumentIcon />
              </a>
            </Action>
          </React.Fragment>
        ) }
      </Actions>
    );
  }
}


const Link = styled.a`
  display: flex;
  align-items: center;
  font-weight: ${props => (props.highlight ? 500 : 'inherit')};
  color: ${props => (props.highlight ? `${color.primary} !important` : 'inherit')};
  opacity: ${props => (props.disabled ? 'none' : 'auto')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`;

export default DocumentActions;
