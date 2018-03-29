import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Paper extends BaseModel {

}


Paper.modelName = 'Paper';
Paper.collectionKey = 'papers';

Paper.fields = {
  ...BaseModel.fields,
  id: attr(),
  title: attr(),
  abstract: attr(),
  year: attr(),
  month: attr(),
  volume: attr(),
  pages: attr(),
  page_from: attr(),
  page_to: attr(),
  authors: many('Author', 'papers')
};


Paper.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  title: null,
  abstract: null,
  year: null,
  month: null,
  volume: null,
  pages: null,
  page_from: null,
  page_to: null,
  // name: null,
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  abstract: PropTypes.string,
  year: PropTypes.number,
  month: PropTypes.number,
  volume: PropTypes.string,
  pages: PropTypes.string,
  page_from: PropTypes.string,
  page_to: PropTypes.string,
  // name: PropTypes.string,
});


export default Paper;
export { Shape };
