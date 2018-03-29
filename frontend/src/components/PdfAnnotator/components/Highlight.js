import React   from 'react';
import styled from 'styled-components';

const Highlight = ({
  highlight,
  isScrolledTo,
  onMouseOver,
  onMouseOut,
}) => {
  const pallete = {
    0: 'rgba(255, 255, 0, .75)',
    2: 'rgba(255, 255, 0, .75)',
    3: 'rgba(0, 255, 255, .75)',
    4: 'yellow'
  };

  return (
    <StyledHighlightLayer>
      {
        highlight.selectors && highlight.selectors.pdfRectangles.map(
          (rect, index) => (
            <StyledHighlight
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              key={`highlight_${index}`}
              rect={rect}
            />
          )
        )
      }
    </StyledHighlightLayer>
  );
};

const StyledHighlightLayer = styled.div`
  user-select: none;
  -webkit-touch-callout: none;
  opacity: 0.4;
  // do not lighten up colors by highlighting, e.g., black text remains black
  // although we the highlight is a layer on top of the text.
  mix-blend-mode: multiply;
  
  ${StyledHighlight} {
    transition: background-color 0.3s ease;
  }
`;
const StyledHighlight = styled.div`
  background-color: yellow;
  cursor: pointer;
  position: absolute;
  top: ${props => (props.rect.top * 100)}%;
  left: ${props => (props.rect.left * 100)}%;
  height: ${props => (props.rect.height * 100)}%;
  width: ${props => (props.rect.width * 100)}%;
`;
export default Highlight;
