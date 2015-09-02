/* @flow */

export default function request(endpoint, data) {
  const opts = {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  return fetch(endpoint, opts).then(res => res.json());
}
