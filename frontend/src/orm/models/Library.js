import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Library extends BaseModel {

}


Library.modelName = 'Library';
Library.collectionKey = 'libraries';

Library.fields = {
  ...BaseModel.fields,
  id: attr(),
  name: attr(),
  description: attr(),
  color: attr(),
  owner: fk('Profile', 'libraries'),
  files: many('File', 'library'),
  createdAt: attr(),
  updatedAt: attr(),
};


Library.defaultProps = {
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


export default Library;
export { Shape };
