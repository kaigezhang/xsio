// @flow

import sortBy from 'lodash/sortBy';
import naturalSort from 'natural-sort';

export default(sortableArray, key) => {
  const keys = sortableArray.map(object => object[key]);
  keys.sort(naturalSort());
  return sortBy(sortableArray, object => keys.indexOf(object[key]));
};
