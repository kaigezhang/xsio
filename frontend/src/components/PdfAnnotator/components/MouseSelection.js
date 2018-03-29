import React, { Component  } from 'react';
import styled from 'styled-components';
import { getCanvasFromElement, getPageFromElement } from 'utils/pdf/pdfDom';
import { view, store } from 'react-easy-state';

const lastVisible = false;

@view
class MouseSelection extends Component {
  obs = store({
    start: null,
    end: null,
    locked: false
  })

  reset = () => {
    const { onDragEnd } = this.props;
    onDragEnd();
    this.obs.start = null;
    this.obs.end = null;
    this.obs.locked = false;
  }

  getBoundingRect = (start, end) => ({
    left: Math.min(end.x, start.x),
    top: Math.min(end.y, start.y),

    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  })


  componentDidMount() {
    if (!this.root) {
      return;
    }

    const that = this;
    const { onSelection, onDragStart, onDragEnd, shouldStart } = this.props;
    const container = this.root.parentElement;

    if (!(container instanceof HTMLElement)) {
      return;
    }

    let containerBoundingRect = null;
    const containerCoors = (pageX, pageY) => {
      if (!containerBoundingRect) {
        containerBoundingRect = container.getBoundingClientRect();
      }

      // 后续装换成给予比例的模型
      return {
        x: (pageX - containerBoundingRect.left) + container.scrollLeft,
        y: (pageY - containerBoundingRect.top) + container.scrollTop
      };
    };


    container.addEventListener('mousedown', (e) => {
      // e.preventDefault();
      if (!shouldStart(e)) {
        this.reset();
        return;
      }

      const startTarget = e.target;
      if (!(startTarget instanceof HTMLElement)) {
        return;
      }
      onDragStart();

      this.obs.start = containerCoors(e.pageX, e.pageY);
      this.obs.end = null;
      this.obs.locked = false;

      const onMouseMove = (e) => {
        // e.currentTarget.removeEventListener('mousemove', onMouseMove);
        const { start, locked } = this.obs;
        if (!start || locked) {
          return;
        }
        this.obs.end = containerCoors(e.pageX, e.pageY);
        console.log('mousemove....', this.obs.start, this.obs.end);
      };


      const onMouseUp = (e) => {
        e.currentTarget.removeEventListener('mouseup', onMouseUp);
        const { start } = that.obs;

        if (!start) {
          return;
        }
        const endTarget = e.target;
        if (
          !(endTarget instanceof HTMLElement)
        ) {
          that.reset();
          return;
        }

        const end = containerCoors(e.pageX, e.pageY);
        const boundingRect = that.getBoundingRect(start, end);
        if (// !container.contains(e.target) ||
          !that.shouldRender(boundingRect)) {
          that.reset();
          return;
        }

        that.obs.end = end;
        that.obs.locked = true;

        if (e.target instanceof HTMLElement) {
          onSelection(startTarget, boundingRect, that.reset);
          onDragEnd();
        }
        if (window.body) {
          document.body.removeEventListener('mouseup', onMouseUp);
          document.body.removeEventListener('mousemove', onMouseMove);
        }
        that.obs.start = null
        that.obs.end = null
        that.obs.locked = false
      };
      if (document.body) {
        document.body.addEventListener('mouseup', onMouseUp);
        document.body.addEventListener('mousemove', onMouseMove);
      }
    });
  }

  shouldRender = boundingRect => boundingRect.width >= 1 && boundingRect.height >= 1

  render() {
    const { start, end } = this.obs;
    return (
      <StyledContainer
        innerRef={node => this.root = node}
      >
        {
          start && end ? (
            <StyledDiv
              style={this.getBoundingRect(start, end)}
            />
          ) : null
        }
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  cursor: crosshair;
  z-index: -1;
`;

const StyledDiv = styled.div`
  position: absolute;
  border: 2px dashed #333;
  background-color: yellow;
  opacity: .3;
`;

export default MouseSelection;
