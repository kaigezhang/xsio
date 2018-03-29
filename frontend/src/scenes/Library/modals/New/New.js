import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Button from 'components/Button';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';
import HelpText from 'components/HelpText';

const propTypes = {
  history: PropTypes.object,
  library: PropTypes.object,
  onSubmit: PropTypes.func,
};


class LibraryNew extends Component {
  state = {
    name: '',
    color: '',
    description: '',
    isSaving: false
  }

  handleSubmit = async (ev) => {
    ev.preventDefault();

    this.setState({
      isSaving: true
    });


    const library = await this.props.createLibrary({
      name: this.state.name,
      color: this.state.color,
      description: this.state.description,
    });

    console.log(library, 'payload')

    const libraryId = Object.values(library.libraries)[0].id;

    if (libraryId) {
      this.props.clearActiveModal()
      this.props.history.push(`/libraries/${libraryId}`);
    } else {
      this.props.history.push('/dashboard');
    }

    this.setState({
      isSaving: false
    });
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
      <form onSubmit={this.handleSubmit}>
        <HelpText>
          library是一些列相关文章的集合
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
        <Button type="submit" disabled={this.state.isSaving || !this.state.name} >
          { this.isSaving ? '创建中...' : '创建'}
        </Button>
      </form>
    );
  }
}

export default withRouter(LibraryNew);
