import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Flex from 'shared/components/Flex';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

import PlusIcon from 'components/Icon/PlusIcon';
import CollectionIcon from 'components/Icon/CollectionIcon';

import Header from './Header';
import SidebarLink from './SidebarLink';

const librariesPropTypes = {
  libraries: PropTypes.array,
  onCreateLibrary: PropTypes.func,
};

const Libraries = (props) => {
  const { libraries, onCreateLibrary } = props;

  return (
    <Flex column>
      <Header>Libraries</Header>
      { libraries.length > 0 && libraries.map(library => (
        <SidebarLink
          key={library.id}
          to={`/libraries/${library.id}`}
          icon={<CollectionIcon color={library.color} />}
          iconColor={library.color}
        >
          <LibraryName justify="space-between">
            { library.name }
          </LibraryName>
        </SidebarLink>

      ))}

      <SidebarLink
        onClick={onCreateLibrary}
        icon={<PlusIcon />}
      >
        New library
      </SidebarLink>
    </Flex>
  );
};


const LibraryName = styled(Flex)`
  padding: 0 0 4px;
`;

export default Libraries;
