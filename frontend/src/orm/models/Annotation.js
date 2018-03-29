import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Annotation extends BaseModel {

}

Annotation.modelName = 'Annotation';
Annotation.collectionKey = 'annotations';

Annotation.fields = {
  ...BaseModel.fields,
  id: attr(),
  author: fk('Profile', 'annotations'),
  selectors: attr(),
  comment: attr(),
  file: fk('File', 'annotations'),
  comments: many('Comment', 'annotations'),
  tags: many('Tag', 'annotations'),
};

Annotation.defaultProps = {
  ...BaseModel.defaultProps,
  selectors: null,
  comment: null
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  selectors: PropTypes.object,
  comment: PropTypes.str,
});


export default Annotation;
export { Shape };
