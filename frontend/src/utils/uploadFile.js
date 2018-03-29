import { fetch } from 'services/api/api/helpers';
import invariant from 'invariant';

// type options = {   name, }

export const uploadFile = async (file, option) => {
  const filename = file instanceof File
    ? file.name
    : option.name;
  const response = await fetch('/user/s3upload', {
    kind: file.type,
    size: file.size,
    filename
  });

  invariant(response, 'Response should be avaliable');

  const data = response.data;
  const asset = data.asset;
  const formData = new FormData();

  // for (const key in data.form) {   forData.append(key, data.form[key]); }

  Object
    .keys(data.form)
    .map(key => formData.append(key, data.form[key]));

  if (file.blob) {
    formData.append('file', file.file);
  } else {
    formData.append('file', file);
  }

  const options = {
    method: 'post',
    body: formData
  };

  await fetch(data.uploadUrl, options);
  return asset;
};

export const dataUrlToBlob = (dataURL) => {
  const blobBin = atob(dataURL.split(',')[1]);
  const array = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }

  const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
  return file;
};
