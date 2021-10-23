// Modules
import { removeNull } from '../../Utils/utils';
import { setIsUploading, updateFlagState } from '../Actions/flagsActions';
import { showError, updateAppState } from '../Actions/appActions';
import FetchOptions from '../../Utils/FetchOptions';
import { errorTypes } from '../../config';

export default function s3Middleware({ dispatch }) {
  return function (next) {
    return function (action) {
      const { payload } = action;

      if (payload && payload.s3Middleware) {
        console.log('Running s3 fetch');
        dispatch(setIsUploading(true));

        const { pictures } = payload;

        Promise.allSettled(
          pictures.map(async picture => {
            const res = await putObject(picture, dispatch);
            return res;
          })
        )
          .then(responses => {
            console.log('Returned fetch responses: ', responses);
            dispatch(updateAppState({ putUrls: [] }));
            dispatch(setIsUploading(false));
            dispatch(updateFlagState({ isCreated: { value: true } }));
          })
          .catch(err => {
            dispatch(showError({ type: errorTypes.uploaderror, message: err }));
            dispatch(setIsUploading(false));
          });
      }

      next(action);
    };
  };
}

async function putObject(picture, dispatch) {
  const { file, signedUrl } = picture;
  console.log('Picture to put: ', picture);
  console.log('Signed Url: ', signedUrl);

  const headers = {
    'Content-Type': 'image/jpg',
    'Content-Disposition': `attachment; filename=\"${file.name}\"`,
  };

  const fetchOptions = removeNull(new FetchOptions('PUT', headers));
  fetchOptions.body = picture;

  console.log('Fetch Options: ', fetchOptions);
  let fetchRes;

  // call fetch here
  await fetch(signedUrl, fetchOptions)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
    })
    .then(() => {
      fetchRes = { successful: true, picture: picture };
    })
    .catch(err => {
      fetchRes = { successful: false, picture: picture };
      dispatch(
        showError({
          type: errorTypes.uploaderror,
          message: `Error occured in uploading ${file.name} with response ${err}`,
        })
      );
    });

  return fetchRes;
}
