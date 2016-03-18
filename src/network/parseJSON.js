export default function parseJSON(res) {
  if (res.status !== 200) {
    throw new Error('Invalid request.');
  }

  return res.json().then(json => json.data);
}
