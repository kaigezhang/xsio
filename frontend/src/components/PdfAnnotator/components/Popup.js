import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import { view, store } from 'react-easy-state';

import MouseMonitor from './MouseMonitor';

@view
class Popup extends Component {
  obs = store({
    mouseIn: false
  })

  render() {
    const { onMouseOver, onMouseOut, popupContent } = this.props;
    return (
      <div
        onMouseOver={() => {
          this.obs.mouseIn = true;
          onMouseOver(
            <MouseMonitor
              onMoveAway={() => {
                // if (this.obs.mouseIn) {
                //   return;
                // }
                onMouseOut();
              }}
              paddingX={60}
              padddingY={30}
              childrenNode={popupContent}
            />
          );
        }}
        onMouseOut={() => {
          this.obs.mouseIn = false;
        }}
      >
        { this.props.childrenNode }
      </div>
    );
  }
}

export default Popup;
