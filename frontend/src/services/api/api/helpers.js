/* 针对api的配置信息 */
import 'es6-promise/auto';
import ExtendableError from 'es6-error';

import axios from 'axios';

import { SubmissionError } from 'redux-form';

import { log } from 'src/debug';
import { t } from 'utils/translations';
import { notifications, constants } from 'src/config';

import { requestNotification } from 'store/actions/notifications';
import { userSelector } from 'store/selectors/shared/auth';
import { normalize as normalizeFn, normalizeError as normalizeErrorFn } from './normalize';

axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
axios.defaults.baseURL = constants.API_URL;

export class ApiRecordError extends ExtendableError {
  constructor(errors) {
    super('An api request failed');
    this.errors = errors;
  }
}

// TODO 目前对于token的初始话还是没有好的方法
/* 初步方法，对与所有的需要token的节点，在api接口出进行token调用 */
let dispatch = null;
export function initializeApi(store) {
  dispatch = store.dispatch;
}


export const initialHttp = (store) => {
  axios.interceptors.request.use((config) => {
    const state = store.getState();
    const user = userSelector(state);

    const token = user ? user.token : null;
    if (config.headers.Authorization === null) {
      delete config.headers.Authorization;
    } else if (!config.headers.Authorization) {
      config.headers.Authorization = token ? `Token ${token}` : '';
    }
    return config;
  });
};
function prependLog(url, method, type) {
  return `${method} ${url}: [${type}]`;
}

function logResponse(response) {
  const { headers, config } = response;
  const { url, method } = config;

  if (!headers) {
    return;
  }

  const requestId = headers['X-Request-Id'] || headers['x-request-id'];
  log(`${prependLog(url, method.toUpperCase(), 'Response')} Statuscode ${response.status} (Request ID: ${requestId})`);
}

function handleSuccess(result) {
  logResponse(result);
  return Promise.resolve(result.data);
}

function handleError(result) {
  const { response } = result;
  if (response && response.status && response.status < 500) {
    logResponse(response);
    if (response.status === 429) {
      dispatch(requestNotification({ type: notifications.failure, text: t('Too many requests. Please try again in a few seconds.') }));
    }
    return Promise.reject(response.data);
  }
  // trackError(result);
  dispatch(requestNotification({
    type: notifications.failure,
    text: t('There was an Error processing your request. Please contact service@xueshu.io i' +
        'f the problem persists.')
  }));
  // throw Error(result);
}

export function fetch(endpoint, description) {
  /* 不能直接throw */
  if (!dispatch) {
    throw new Error('Api service has not been initialized with store');
  }

  description.url = endpoint;
  description.headers = {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
    // Authorization: token
    //   ? `Token ${token}`
    //   : '',
    ...(description.headers || {})
  };
  // send {} as data otherwise axios omits the Content-Type header
  if (!description.data) {
    description.data = {};
  }

  log(`${prependLog(endpoint, description.method, 'Request')}`);

  return axios
    .request(description)
    .then(handleSuccess)
    .catch(handleError);
}

export function normalize(customNormalizeFunction) {
  return (result) => {
    if (customNormalizeFunction) {
      return customNormalizeFunction(result);
    }
    return normalizeFn(result);
  };
}

export function normalizeErrors(customNormalizeErrorFn, throwSubmissionError = false) {
  return (response) => {
    if (customNormalizeErrorFn) {
      return Promise.reject(customNormalizeErrorFn(response));
    }
    const errors = normalizeErrorFn(response);
    if (throwSubmissionError) {
      throw new SubmissionError(errors);
    }
    return Promise.reject(errors);
  };
}
