import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Comment extends BaseModel {

}


Comment.modelName = 'Comment';
Comment.collectionKey = 'comments';

Comment.fields = {
  ...BaseModel.fields,
  id: attr(),
  body: attr(),
  author: fk('Profile', 'comments'),
};


Comment.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  body: null,
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  body: PropTypes.string,
});


export default Comment;
export { Shape };
