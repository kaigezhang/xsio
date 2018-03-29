import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Journal extends BaseModel {

}


Journal.modelName = 'Journal';
Journal.collectionKey = 'journals';

Journal.fields = {
  ...BaseModel.fields,
  id: attr(),
  name: attr(),
};


Journal.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  name: null,
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
});


export default Journal;
export { Shape };
