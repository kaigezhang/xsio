import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Author extends BaseModel {

}


Author.modelName = 'Author';
Author.collectionKey = 'authors';

Author.fields = {
  ...BaseModel.fields,
  id: attr(),
  initials: attr(),
  forename: attr(),
  lastname: attr(),
};


Author.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  initials: null,
  forename: null,
  lastname: null,
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  initials: PropTypes.string,
  forename: PropTypes.string,
  lastname: PropTypes.string,
});


export default Author;
export { Shape };
