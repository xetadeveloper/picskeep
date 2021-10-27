// Modules
import { removeNull } from '../../Utils/utils';
import { setIsUploading, updateFlagState } from '../Actions/flagsActions';
import { showError, updateAppState } from '../Actions/appActions';
import FetchOptions from '../../Utils/FetchOptions';
import { errorTypes } from '../../config';
import { createPictures } from '../Actions/httpActions';

export default function s3Middleware({ dispatch }) {
  return function (next) {
    return function (action) {
      const { payload } = action;

      if (payload && payload.s3Middleware) {
        // console.log('Running s3 fetch');
        dispatch(setIsUploading(true));

        const { pictures } = payload;

        Promise.allSettled(
          pictures.map(async picture => {
            const res = await putObject(picture, dispatch);
            return res;
          })
        )
          .then(responses => {
            // console.log('Returned fetch responses: ', responses);

            const successfulUploads = responses
              .filter(response => response.status === 'fulfilled')
              .map(response => response.value.picture.file.name);

            const failedUploads = responses
              .filter(response => response.status !== 'fulfilled')
              .map(response => response.value.picture.file.name);

            // console.log('Successful uploads: ', successfulUploads);
            // console.log('Failed uploads: ', failedUploads);

            // dispatch action to update DB
            if (successfulUploads.length) {
              dispatch(
                createPictures({
                  method: 'POST',
                  fetchBody: { data: { fileNames: successfulUploads } },
                  headers: { 'Content-Type': 'application/json' },
                })
              );
            }

            if (failedUploads.length) {
              // Dispatch error for those that failed
              dispatch(
                showError({
                  type: errorTypes.uploaderror,
                  message: `Some uploads failed: \n${failedUploads}`,
                })
              );
            }

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
  // console.log('Picture to put: ', file);
  // console.log('Signed Url: ', signedUrl);

  const headers = {
    'Content-Type': 'image/jpg',
    'Content-Disposition': `attachment; filename=\"${file.name}\"`,
  };

  const fetchOptions = removeNull(new FetchOptions('PUT', headers));
  fetchOptions.body = file;

  // console.log('Fetch Options: ', fetchOptions);
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
