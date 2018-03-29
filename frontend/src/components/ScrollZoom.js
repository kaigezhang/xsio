import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import Flex from 'shared/components/Flex'


const propTypes = {
  children: PropTypes.node.isRequired,
  zoomin: PropTypes.func.isRequired,
  zoomout: PropTypes.func.isRequired,
};


class ScrollZoom extends Component {
  componentDidMount() {
    this.container.addEventListener('DOMMouseScroll', this.handleMouseWheel);
    this.container.addEventListener('mousewheel', this.handleMouseWheel);
  }

  componentWillUnmount() {
    this.container.removeEventListener('DOMMouseScroll', this.handleMouseWheel);
    this.container.removeEventListener('mousewheel', this.handleMouseWheel);
  }

  handleMouseWheel = (e) => {
    if (e.ctrlKey) {
      if (e.wheelDelta < 0) {
        if (this.props.zoomout) this.props.zoomout();
      } else if (e.wheelDelta > 0) {
        if (this.props.zoomin) this.props.zoomin();
      }
      // 只缩放窗口
      e.preventDefault();
    }
  }

  render() {
    const { children, zoomin, zoomout, ...restProps } = this.props;

    return (
      <StyledContainer
        innerRef={div => this.container = div}
        align="flex-start"
        {...restProps}
      >
        { children }
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`

ScrollZoom.propTypes = propTypes;

export default ScrollZoom;
