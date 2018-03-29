import PropTypes from 'prop-types';
import { attr, fk, OneToOne, many } from 'redux-orm';

import BaseModel from './BaseModel';

class User extends BaseModel {
  // get fullname() {
  //   return `${this.firstname} ${this.lastname}`;
  // }
  //
  // get includeRef() {
  //   return Object.assign(super.includeRef, { fullname: this.fullname });
  // }
}

User.modelName = 'User';
User.collectionKey = 'users';

User.fields = {
  ...BaseModel.fields,
  id: attr(),
  email: attr(),
  // unconfirmedEmail: attr(),
  // firstName: attr(),
  // lastName: attr(),
  username: attr(),
  // TODO 数据库暂时未包含
  // privacyPolicyAccepted: attr(),
  // createdAt: attr(),
  // unreadPostsPresent: attr(),
  // locality: fk('Locality'),
  // profile: OneToOne('Profile'),

};

User.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  email: null,
  username: null,
  // unconfirmedEmail: null,
  // firstName: null,
  // lastName: null,
  // privacyPolicyAccepted: false,
  // createAt: null,
  // unreadPostsPresent: false
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  email: PropTypes.string,
  username: PropTypes.string,
  // createdAt: PropTypes.number,
  // firstName: PropTypes.string,
  // lastName: PropTypes.string,
  // privacyPolicyAccepted: PropTypes.bool,
  // unreadPostsPresent: PropTypes.bool
});

export default User;
export { Shape };
