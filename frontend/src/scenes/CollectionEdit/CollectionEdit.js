// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Button from 'components/Button';
import Input from 'components/Input';
import Flex from 'shared/components/Flex';
import HelpText from 'components/HelpText';
import ColorPicker from 'components/ColorPicker';

const propTypes = {
  history: PropTypes.object,
  collection: PropTypes.object,
  onSubmit: PropTypes.func,
};

class CollectionEdit extends Component {
  state = {
    name: '',
    color: '',
    isSaving: false
  }

  componentWillMount = () => {
    this.state.name = this.props.collection.name;
  }
  handleSubmit = async (ev) => {
    ev.preventDefault();

    this.setState({ isSaving: true });

    this.props.updateCollection({
      name: this.state.name,
      color: this.state.color,
    });

    this.setState({ isSaving: false });
  }

  handleNameChange = (ev) => {
    this.setState({
      name: ev.target.value
    });
  }

  handleColor = (color) => {
    this.setState({
      color,
    });
  }

  render() {
    return (
      <Flex column>
        <form onSubmit={this.handleSubmit}>
          <HelpText>
            你可以随意修改你的文集
          </HelpText>

          <Input
            type="text"
            label="Name"
            onChange={this.handleNameChange}
            value={this.state.name}
            required
            autoFocus
          />

          <ColorPicker
            onSelect={this.handleColor}
            value={this.props.collection.color}
          />

          <Button
            type="submit"
            disabled={this.state.isSaving || !this.props.collection.name}
          >
            { this.isSaving ? '保存中...' : '保存'}
          </Button>
        </form>
      </Flex>
    );
  }
}

export default withRouter(CollectionEdit);
