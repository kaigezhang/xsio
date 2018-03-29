import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { homeUrl } from 'utils/routeHelpers';
import Button from 'components/Button';
import Flex from 'shared/components/Flex';
import HelpText from 'components/HelpText';


const propTypes = {
  history: PropTypes.object,
  library: PropTypes.object,
  libraries: PropTypes.object,
  onSubmit: PropTypes.func,
};

class LibraryDelete extends Component {
  state = {
    isDeleting: false
  }

  handleSubmit = async (ev) => {
    ev.preventDefault();

    this.setState({
      isDeleting: true
    });
    // 这里success获取不到
    const success = await this.props.deleteLibrary(this.props.library);
    if (success) {
      this.props.libraries.remove(this.props.library.id);
      this.props.history.push(homeUrl());
      this.props.onSubmit();
    }

    this.isDeleting = false;
  }


  render() {
    const { library } = this.props;

    return (
      <Flex column>
        <form onSubmit={this.handleSubmit}>
          <HelpText>
            确定吗？删除<strong>{library.name}</strong>是永久的，并且所有子文档也会被删除，请谨慎操作
          </HelpText>
          <Button type="submit" danger>
            { this.state.isDeleting ? '删除中...' : '删除'}
          </Button>
        </form>
      </Flex>
    );
  }
}


export default LibraryDelete;
