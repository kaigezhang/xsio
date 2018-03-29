import React from 'react';
// import PropTypes from 'prop-types';
import InlineCode from './components/InlineCode';

// const props = {   children: PropTypes.child,   mark: PropTypes.any, };

export default function renderMark(props) {
  switch (props.mark.type) {
  case 'bold':
    return <strong>{props.children}</strong>;
  case 'code':
    return <InlineCode>{props.children}</InlineCode>;
  case 'italic':
    return <em>{props.children}</em>;
  case 'underlined':
    return <u>{props.children}</u>;
  case 'deleted':
    return <del>{props.children}</del>;
  case 'added':
    return <mark>{props.children}</mark>;
  default:
  }
}
