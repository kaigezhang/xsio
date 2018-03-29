import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';


class Post extends BaseModel {

}

Post.modelName = 'Post';
Post.collectionKey = 'posts';

Post.fields = {
  ...BaseModel.fields,
  id: attr(),
  headline: attr(),
  slug: attr(),
  body_text: attr(),
  author: fk('Profile', 'posts'),
  files: many('File', 'posts'), // 文件的ids
  tags: many('Tag', 'posts'),
  comments: many('Comment', 'posts'),
};

Post.defaultProps = {
  ...BaseModel.defaultProps,
  headline: null,
  slug: null,
  body_text: null,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  headline: PropTypes.string,
  slug: PropTypes.string,
  body_text: PropTypes.string,
});


export default Post;
export { Shape };

