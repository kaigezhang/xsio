import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MouseMonitor extends Component {
  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = (e) => {
    if (!this.container) {
      return;
    }

    const { onMoveAway, paddingX, paddingY } = this.props;
    const { clientX, clientY } = e;
    const { left, top, width, height } = this.container.getBoundingClientRect();

    const inBoundsX =
      clientX > left - paddingX && clientX < left + width + paddingX;
    const inBoundsY =
      clientY > top - paddingY && clientY < top + height + paddingY;

    const isNear = inBoundsX && inBoundsY;

    if (!isNear) {
      onMoveAway();
    }
  }
  render() {
    // eslint-disable-next-line
    const { onMoveAway, paddingX, paddingY, ...restProps } = this.props;
    console.log('render mouse monitor', this.props.childrenNode);
    return (
      <div ref={node => this.container = node}>
        { React.cloneElement(this.props.childrenNode, restProps)}
      </div>
    );
  }
}

MouseMonitor.propTypes = {
  onMouseAway: PropTypes.func,
  paddingX: PropTypes.number,
  padddingY: PropTypes.number,
  childrenNode: PropTypes.node,
};

export default MouseMonitor;
