import React from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import ZoomInIcon from 'components/Icon/ZoomInIcon';
import ZoomOutIcon from 'components/Icon/ZoomOutIcon';
import CutIcon from 'components/Icon/CutIcon';

const Toolbar = ({
  zoomin,
  zoomout,
  enableAreaSelection
}) => (
  <StyledToolbar>
    <StyledButton
      icon={<ZoomInIcon light size={24} viewBox="0 0 1024 1024" />}
      onClick={zoomin}
    />
    <StyledButton
      icon={<ZoomOutIcon light viewBox="0 0 1024 1024" />}
      onClick={zoomout}
    />
    <StyledButton
      icon={<CutIcon light viewBox="0 0 1024 1024" />}
      onClick={enableAreaSelection}
    />
  </StyledToolbar>
);

const StyledButton = styled(Button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
const StyledToolbar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  ${StyledButton} {
    margin-bottom: 1.2rem;
    display: block;
    width: 40px;
    height: 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default Toolbar;
