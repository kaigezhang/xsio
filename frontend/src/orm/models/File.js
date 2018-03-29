import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class File extends BaseModel {

}


File.modelName = 'File';
File.collectionKey = 'files';

File.fields = {
  ...BaseModel.fields,
  id: attr(),
  hash: attr(),
  name: attr(),
  paper: fk('Paper', 'files'),
};


File.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  hash: null,
  name: null,
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  hash: PropTypes.string,
  name: PropTypes.string,
});


export default File;
export { Shape };
