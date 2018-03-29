import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MoreIcon from 'components/Icon/MoreIcon';
import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';


const propTypes = {
  label: PropTypes.any,
  history: PropTypes.object,
  file: PropTypes.object,
  className: PropTypes.string,
};


class FileMenu extends Component {
  handleDelete = (ev) => {
    const { file } = this.props;
    this.props.setActiveModal('File-delete', { file });
  };

  handlePin = (ev) => {
    this.props.pinFile(this.props.file.id);
  };

  handleUnpin = (ev) => {
    this.props.unpinFile(this.props.file.id);
  };

  handleStar = (ev) => {
    this.props.starFile(this.props.file.id);
  };

  handleUnstar = (ev) => {
    this.props.unstarFile(this.props.file.id);
  };

  handleExport = (ev) => {
    this.props.downloadFile(this.props.file);
  };
  render() {
    const { file, label, className } = this.props;

    return (
      <DropdownMenu label={label || <MoreIcon />} className={className}>
        <React.Fragment>
          {
            File.pinned ? (
              <DropdownMenuItem onClick={this.handleUnpin}>Unpin</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={this.handlePin}>Pin</DropdownMenuItem>
            )
          }

          {
            File.starred ? (
              <DropdownMenuItem onClick={this.handleUnstar}>Unstar</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={this.handleStar}>Star</DropdownMenuItem>
            )
          }
          <hr />
        </React.Fragment>
        <DropdownMenuItem onClick={this.handleDelete}>Delete</DropdownMenuItem>
        <hr />
        <DropdownMenuItem onClick={this.handleExport}>Download</DropdownMenuItem>
      </DropdownMenu>
    );
  }
}


export default withRouter(FileMenu);
