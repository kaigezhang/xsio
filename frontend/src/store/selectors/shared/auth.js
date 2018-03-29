

import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector } from '../orm';

export const authSelector = state => state.auth;

export const userSelector = createSelector(
  ormSelector,
  authSelector,
  createOrmSelector((session, { user }) => {
    if (!user) {
      return null;
    }
    const authUser = session.User.get({ id: user });
    return authUser ? authUser.includeRef : null;
  })
);
