/* @flow */

export default function request(endpoint, data, files) {
  if (data.query) {
    const query = encodeURIComponent(data.query);
    const variables = encodeURIComponent(JSON.stringify(data.params));
    return fetch(`${endpoint}?query=${query}&variables=${variables}`).then(parseJSON);
  }
  if (data.mutation) {
    const formData = new FormData();
    formData.append('query', data.mutation);
    formData.append('variables', JSON.stringify(data.params));
    if (files) {
      for(let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    }
    return fetch(endpoint, {
      method: 'post',
      body: formData,
    }).then(parseJSON);
  }

  throw new Error('Unsupported request');
}

function parseJSON(res) {
  return res.json();
}
