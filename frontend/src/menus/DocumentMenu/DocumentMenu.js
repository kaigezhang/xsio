import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MoreIcon from 'components/Icon/MoreIcon';
import { documentMoveUrl } from 'utils/routeHelpers';
import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';


const propTypes = {
  label: PropTypes.any,
  history: PropTypes.object,
  document: PropTypes.object,
  className: PropTypes.string,
};


class DocumentMenu extends Component {
  handleNewChild = (ev) => {
    const { history, document } = this.props;
    history.push(
      `${document.collection.url}/new?parentDocument=${document.id}`
    );
  };

  handleDelete = (ev) => {
    const { document } = this.props;
    this.props.setActiveModal('document-delete', { document });
  };

  handleMove = (ev) => {
    this.props.history.push(documentMoveUrl(this.props.document));
  };

  handlePin = (ev) => {
    this.props.pinDocument(this.props.document.id);
  };

  handleUnpin = (ev) => {
    this.props.unpinDocument(this.props.document.id);
  };

  handleStar = (ev) => {
    this.props.starDocument(this.props.document.id);
  };

  handleUnstar = (ev) => {
    this.props.unstarDocument(this.props.document.id);
  };

  handleExport = (ev) => {
    this.props.downDocument(this.props.document);
  };
  render() {
    const { document, label, className } = this.props;
    const isDraft = !document.publishedAt;

    return (
      <DropdownMenu label={label || <MoreIcon />} className={className}>
        {!isDraft && (
          <React.Fragment>
            {
              document.pinned ? (
                <DropdownMenuItem onClick={this.handleUnpin}>Unpin</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={this.handlePin}>Pin</DropdownMenuItem>
              )
            }

            {
              document.starred ? (
                <DropdownMenuItem onClick={this.handleUnstar}>Unstar</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={this.handleStar}>Star</DropdownMenuItem>
              )
            }
            <hr />
            <DropdownMenuItem
              onClick={this.handleNewChild}
              title="Create a new child document for the current document"
            >
              New child
            </DropdownMenuItem>
            <DropdownMenuItem onClick={this.handleMove}>Move…</DropdownMenuItem>
          </React.Fragment>
        )}
        <DropdownMenuItem onClick={this.handleDelete}>Delete…</DropdownMenuItem>
        <hr />
        <DropdownMenuItem onClick={this.handleExport}>Download</DropdownMenuItem>
        <DropdownMenuItem onClick={window.print}>Print</DropdownMenuItem>
      </DropdownMenu>
    );
  }
}


export default withRouter(DocumentMenu);
