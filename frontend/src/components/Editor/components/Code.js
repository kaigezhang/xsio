import React from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import CopyButton from './CopyButton';


function getCopyText(node) {
  return node.nodes.reduce((memo, line) => `${memo}${line.text}\n`);
}


export default function Code({
  children,
  node,
  readOnly,
  attributes,
}) {
  return (
    <Container {...attributes} spellCheck={false}>
      {readOnly && <CopyButton text={getCopyText(node)} />}
      <code>{children}</code>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  background: ${color.smokeLight};
  border-radius: 4px;
  border: 1px solid ${color.smokeDark};

  code {
    display: block;
    overflow-x: scroll;
    padding: 0.5em 1em;
    line-height: 1.4em;
  }

  pre {
    margin: 0;
  }

  &:hover {
    > span {
      opacity: 1;
    }
  }
`;
