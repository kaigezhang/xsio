import PropTypes from 'prop-types';
import { attr, fk, oneToOne, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Profile extends BaseModel {
}

Profile.modelName = 'Profile';
Profile.collectionKey = 'profiles';

Profile.fields = {
  ...BaseModel.fields,
  id: attr(),
  user: oneToOne('User', 'profile'),
  bio: attr(),
  image: attr(),
  // follows: many('Profile', 'followed_by'),
  // collects: many('Post', 'collected_by'),
  // favorites: many('Annotation', 'favorited_by'),
  // owns: many('File', 'owned_by'),
};

Profile.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  bio: null,
  image: null,
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  bio: PropTypes.string,
  image: PropTypes.string,
});

export default Profile;
export { Shape };
