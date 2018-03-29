import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Tag extends BaseModel {

}


Tag.modelName = 'Tag';
Tag.collectionKey = 'tags';

Tag.fields = {
  ...BaseModel.fields,
  id: attr(),
  tag: attr(),
  slug: attr(),
};


Tag.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  tag: null,
  slug: null,
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  tag: PropTypes.string,
  slug: PropTypes.string,
});


export default Tag;
export { Shape };
