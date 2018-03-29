import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Document extends BaseModel {}

Document.modelName = 'Document';
Document.collectionKey = 'documents';

Document.fields = {
  ...BaseModel.fields,
  id: attr(),
  slug: attr(),
  private: attr(),
  title: attr(),
  text: attr(),
  parent: fk('Document', 'children'),
  updated_by: fk('Profile', 'updated'),
  created_by: fk('Profile', 'created'),

  createdAt: attr(),
  updatedAt: attr(),

  published_at: attr(),
  views: fk('Profile', 'views'),
  stars: fk('Profile', 'stars'),
  collection: fk('Collection', 'documents'),
  // collaborators: many('Profile', 'documents')
};

Document.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  slug: null,
  private: null,
  title: null,
  text: null,
  // parent: null,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  slug: PropTypes.string,
  private: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  // parent: PropTypes.string,
});

export default Document;
export { Shape };
