// Modules
import { removeNull } from '../../Utils/utils';
import { updateFlagState } from '../Actions/flagsActions';
import { setFetchStatus } from '../Actions/appActions';
import {
  getFailed,
  getSuccessful,
  postFailed,
  postSuccessful,
} from '../Actions/httpActions';

export default function httpMiddleware({ dispatch }) {
  return function (next) {
    return function (action) {
      const { payload } = action;

      if (payload && payload.httpMiddleware) {
        console.log('Running fetch');
        dispatch(setFetchStatus(true));

        const { url, method, fetchBody, headers } = payload;
        console.log('Fetch Body: ', fetchBody);
        console.log('Url: ', url);

        const fetchOptions = removeNull(
          new FetchOptions(method, fetchBody, headers)
        );

        console.log('Fetch Options: ', fetchOptions);

        // call fetch here
        fetch(url, fetchOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Fetch Result: ', data);
            switch (method) {
              case 'GET':
                if (data.app && data.app.error) {
                  dispatch(getFailed(data.app));
                } else {
                  dispatch(getSuccessful(data.app));
                }
                break;

              case 'POST':
                if (data.app && data.app.error) {
                  dispatch(postFailed(data.app));
                } else {
                  dispatch(postSuccessful(data.app));
                  dispatch(updateFlagState(data.flags));
                }
                break;

              default:
                break;
            }

            dispatch(setFetchStatus(false));
          });
      }

      next(action);
    };
  };
}

class FetchOptions {
  constructor(method, fetchBody, headers, mode, cache) {
    this.method = method;
    this.body = method !== 'GET' ? JSON.stringify(fetchBody) : fetchBody;
    this.headers = headers;
    this.mode = mode || 'cors';
    this.cache = cache || 'default';
  }
}
