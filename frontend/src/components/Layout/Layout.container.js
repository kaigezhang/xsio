import React from 'react';
import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/ui';
import { userSelector } from 'store/selectors/shared/auth';
import { activeNotificationsSelector } from 'store/selectors/notifications';
import { setActiveModal } from 'store/actions/ui';
import Layout from './Layout';


const mapState = state => ({
  ui: uiSelector(state),
  user: userSelector(state),
  notifications: activeNotificationsSelector(state)
});


const mapDispatch = dispatch => ({
  setActiveModal: (name, props) => dispatch(setActiveModal(name, props))
});


export default connect(mapState, mapDispatch, null, {
  pure: false
})(Layout);
