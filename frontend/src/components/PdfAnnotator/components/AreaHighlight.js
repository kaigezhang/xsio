import React from 'react';
import styled from 'styled-components';

const pallete = {
  0: 'rgba(255, 255, 0, .75)',
  2: 'rgba(255, 255, 0, .75)',
  3: 'rgba(0, 255, 255, .75)',
  4: 'yellow'
};

const AreaHighlight = ({
  highlight,
  ...restProps
}) => {
  const { selectors: { pdfRectangles: rect } } = highlight;

  return (
    <StyledDiv
      rect={rect}
      {...restProps}
    />
  );
};

const StyledDiv = styled.div`
  border: 2px dotted #333;
  background-color: rgba(252, 252, 51, 1.0);
  opacity: 0.45;
  cursor: pointer;
  position: absolute;
  top: ${props => (props.rect.top * 100)}%;
  left: ${props => (props.rect.left * 100)}%;
  height: ${props => (props.rect.height * 100)}%;
  width: ${props => (props.rect.width * 100)}%;
`;

export default AreaHighlight;
