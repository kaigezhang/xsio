import PropTypes from 'prop-types';
import { attr, fk } from 'redux-orm';

import BaseModel from './BaseModel';

class Collection extends BaseModel {}

Collection.modelName = 'Collection';
Collection.collectionKey = 'collections';

Collection.fields = {
  ...BaseModel.fields,
  id: attr(),
  name: attr(),
  description: attr(),
  color: attr(),
  creator: fk('Profile', 'collections'),
  createdAt: attr(),
  updatedAt: attr(),
};

Collection.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  name: null,
  description: null,
  color: null
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  color: PropTypes.string,
});

export default Collection;
export { Shape };
