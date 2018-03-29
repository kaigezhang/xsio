import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Flex from 'shared/components/Flex';
import HelpText from 'components/HelpText';


const propTypes = {
  history: PropTypes.object,
  document: PropTypes.object,
  documents: PropTypes.object,
  onSubmit: PropTypes.func,
};


class DocumentDelete extends Component {
  state = {
    isDeleting: false
  }

  handleSubmit = async (ev) => {
    ev.preventDefault();
    this.setState({ isDeleting: true });
    const { collection } = this.props.document;
    const success = await this.props.deleteDocument(this.props.document.id);

    if (success) {
      this.props.history.push(`/collections/${collection.id}`);
      this.props.onSubmit();
    }
    this.setState({
      isDeleting: false
    });
  }

  render() {
    const { document } = this.props;

    return (
      <Flex column>
        <form onSubmit={this.handleSubmit}>
          <HelpText>
            Are you sure? Deleting the <strong>{document.title}</strong>{' '}
            document is permanant and will also delete all of its history.
          </HelpText>
          <Button type="submit" danger>
            { this.isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </form>
      </Flex>
    );
  }
}

export default withRouter(DocumentDelete);
