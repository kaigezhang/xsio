// @flow
import React from 'react';
import { Link as InternalLink } from 'react-router-dom';

const BASE_URL = 'http://xueshu.io';

function getPathFromUrl(href) {
  if (href[0] === '/') return href;

  try {
    const parsed = new URL(href);
    return parsed.pathname;
  } catch (err) {
    return '';
  }
}

function isInternalUrl(href) {
  if (href[0] === '/') return true;

  try {
    const baseUrl = new URL(BASE_URL);
    const parsed = new URL(href);
    return parsed.hostname === baseUrl.hostname;
  } catch (err) {
    return false;
  }
}

export default function Link({
  attributes,
  node,
  children,
  readOnly,
}) {
  const href = node.data.get('href');
  const path = getPathFromUrl(href);

  if (isInternalUrl(href) && readOnly) {
    return (
      <InternalLink {...attributes} to={path}>
        {children}
      </InternalLink>
    );
  }
  return (
    <a {...attributes} href={readOnly ? href : undefined} target="_blank">
      {children}
    </a>
  );
}
