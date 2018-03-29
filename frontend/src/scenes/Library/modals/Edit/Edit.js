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
  library: PropTypes.object,
  onSubmit: PropTypes.func,
};

class LibraryEdit extends Component {
  state = {
    name: '',
    color: '',
    isSaving: false
  }

  componentWillMount = () => {
    this.setForm();
  }
  setForm = () => {
    const { name, description } = this.props.library;
    this.setState({
      name, description
    });
  }
  handleSubmit = async (ev) => {
    ev.preventDefault();

    this.setState({ isSaving: true });

    this.props.updateLibrary({
      name: this.state.name,
      description: this.state.description,
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
    this.setState({ color });
  }

  handleDescriptionChange = (ev) => {
    this.setState({ description: ev.target.value });
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
            label="名称"
            onChange={this.handleNameChange}
            value={this.state.name}
            required
            autoFocus
          />

          <Input
            type="textarea"
            label="描述"
            onChange={this.handleDescriptionChange}
            value={this.state.description}
            required
            autoFocus
          />

          <ColorPicker onSelect={this.handleColor} />

          <Button
            type="submit"
            disabled={this.state.isSaving || !this.props.library.name}
          >
            { this.isSaving ? '保存中...' : '保存'}
          </Button>
        </form>
      </Flex>
    );
  }
}

export default withRouter(LibraryEdit);
