import { delay } from 'redux-saga';
import { call, put, takeEvery, fork, select, all } from 'redux-saga/effects';
// import {} from 'redux-router-dom'
import { NOTIFICATION_DISPLAY_REQUEST } from '../constants/notifications';
// import { activeNotificationSelector } from '../selectors/notifications';
import { showNotification, hideNotification } from '../actions/notifications';


export const NOTIFICATIONS_MAX = 2;
export const NOTIFICATIONS_DISPLAY_TIME = 10000;

let pendingNotifications = [];
let activeNotifications = [];

// export function* handleLocationChange() {}
export function* displayNotification(notification) {
  if (activeNotifications.length > NOTIFICATIONS_MAX) {
    throw new Error(`can not display more than ${NOTIFICATIONS_MAX} at the same time`);
  }
  activeNotifications = [...activeNotifications, notification];
  yield put(showNotification(notification));
  yield call(delay, notification.displayTime || NOTIFICATIONS_DISPLAY_TIME);
  yield put(hideNotification(notification));
  activeNotifications = activeNotifications.filter(n => n !== notification);
}


export function* notificationsScheduler(action) {
  while (true) {
    if (activeNotifications.length < NOTIFICATIONS_MAX && pendingNotifications.length > 0) {
      const [firstNotification, ...remainingNotifications] = pendingNotifications;
      pendingNotifications = remainingNotifications;
      yield fork(displayNotification, firstNotification);
      // Add little delay so that 2 concurrent 2 notifications aren't displayed at the same time
      yield call(delay, 300);
    } else {
      yield call(delay, 300);
    }
  }
}

// eslint-disable-next-line require-yield
export function* handleNotificationRequest(action) {
  const newNotification = {
    ...action.payload,
    key: Date.now()
  };

  pendingNotifications = [...pendingNotifications, newNotification];
}

export default function* watchNotifications() {
  yield all([
    takeEvery(NOTIFICATION_DISPLAY_REQUEST, handleNotificationRequest),
    call(notificationsScheduler)
  ]);
}
