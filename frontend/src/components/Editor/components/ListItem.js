// @flow
import React from 'react';
import TodoItem from './TodoItem';

export default function ListItem({
  children,
  node,
  attributes,
  ...props
}) {
  const checked = node.data.get('checked');

  if (checked !== undefined) {
    return (
      <TodoItem node={node} attributes={attributes} {...props}>
        {children}
      </TodoItem>
    );
  }
  return <li {...attributes}>{children}</li>;
}
