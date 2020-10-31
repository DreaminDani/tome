export const post = (url, body) => {
  // request options
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
  }

  // send POST request
  fetch(`/.netlify/functions${url}`, options)
    .then(res => res.json())
    .catch(err => {
      // assume it's not a json response
      return res;
    })
    .then(res => {
      return res;
    });
}