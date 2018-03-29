import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Button from 'components/Button';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';
import HelpText from 'components/HelpText';

const propTypes = {
  history: PropTypes.object,
  collection: PropTypes.object,
  onSubmit: PropTypes.func,
};


class CollectionNew extends Component {
  state = {
    name: '',
    color: '',
    description: '',
    isSaving: false
  }

  // constructor(props) {
  //   super(props);
  // }

  handleSubmit = async (ev) => {
    ev.preventDefault();

    this.setState({
      isSaving: true
    });


    const collection = await this.props.createCollection({
      name: this.state.name,
      color: this.state.color,
      description: this.state.description,
    });

    const collectionId = Object.values(collection.collections)[0].id;

    if (collectionId) {
      this.props.clearActiveModal()
      this.props.history.push(`/collections/${collectionId}`);
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
    console.log(color, 'color');
    this.setState({ color });
  }

  handleDescriptionChange = (ev) => {
    this.setState({ description: ev.target.value });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <HelpText>
          文集是一系列相关文件的集合
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

export default withRouter(CollectionNew);
