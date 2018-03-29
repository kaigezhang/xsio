import React from 'react';

import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';
import PageTitle from 'components/PageTitle';
import PublishingInfo from './PublishingInfo.container';

/* eslint-disable no-restricted-globals */
const updateHash = (highlight) => {
  location.hash = `highlight-${highlight}`;
};
/* eslint-enable no-restricted-globals */

const Sidebar = ({
  file
}) => (

  <StyledSidebar>
    <PageTitle title="Annotations" />

    <StyledContainer>
      <ul className="sidebarHighlights">
        {
          file.annotationIds.length ? file.annotationIds.map((highlight, index) => (
            <li
              key={`highlight_${index}`}
              onClick={e => updateHash(highlight)}
            >
              <PublishingInfo highlight={highlight} />
            </li>
          )) : null
        }
      </ul>
    </StyledContainer>
  </StyledSidebar>

);


const StyledSidebar = styled.div`
  overflow-y:scroll; 
  position:relative;
  height: 100vh;
`;
const StyledContainer = styled(Flex)`
  flex-direction: column;
  ul {
    list-style: none;
    padding: 0;
    li {
      //padding: 0 0 0 12px;
      margin: 16px 32px;
    }
  }
`;


export default Sidebar;
