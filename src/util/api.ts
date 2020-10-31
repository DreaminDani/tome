export const post = async (url: string, body: object) => {
  // request options
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // send POST request
  const response = await fetch(`/.netlify/functions${url}`, options);
  const text = await response.text();
  try {
    const result = JSON.parse(text);
    const type = Object.prototype.toString.call(result);
    if (type === '[object Object]' || type === '[object Array]') {
      return result
    }
  } catch (err) {
    return text;
  }
}