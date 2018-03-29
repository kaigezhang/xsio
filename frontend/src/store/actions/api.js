import { API_FETCHED } from 'store/constants/api';

export function apiFetched(payload) {
  return { type: API_FETCHED, payload };
}
