import React, { Component } from 'react';
import last from 'lodash/last';
import styled from 'styled-components';

class TipContainer extends Component {
  state = {
    height: 0,
    width: 0,
  }


  componentDidMount() {
    setTimeout(this.updatePosition, 0);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.childrenNode !== this.props.childrenNode) {
      this.updatePosition();
    }
  }

  getRect = () => {
    const { popupTarget } = this.props;
    const { selectors } = popupTarget;
    if (!selectors || !selectors.pdfRectangles) {
      console.warn('selectors object does not have a pdfRectangles property');
      return null;
    }

    const rect = selectors.isBackwards ? selectors.pdfRectangles[0] : last(selectors.pdfRectangles);

    // if (rect.pageNumber !== pageNumber) {
    //   return null;
    // }
    return rect;
  }

  updatePosition() {
    console.log(this.containerNode, 'containerNode');
    // const { offsetHeight, offsetWidth } = this.containerNode; this.setState({
    // height: offsetHeight,   width: offsetWidth, });
  }
  render() {
    const { style, childrenNode } = this.props;

    // const { height, width } = this.state;
    // const isStyleCalculationInProgress = width === 0 && height === 0;
    console.warn('childrenNonde', childrenNode);

    return (
      <StyledTipButtons
        style={style}
        ref={div => this.containerNode = div}
      >
        <StyledTipContent>
          { childrenNode }
        </StyledTipContent>
      </StyledTipButtons>
    );
  }
}

const StyledTipButtons = styled.div`
  position: absolute;
  display: inline-block;
`;

const StyledTipContent = styled.div`
  position: relative;
  background-image: linear-gradient(to bottom,rgba(49,49,47,.99),#262625);
  background-repeat: repeat-x;
  z-index: 10;
`;

export default TipContainer;
