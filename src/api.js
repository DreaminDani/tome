import fetch from 'isomorphic-fetch';

export const postData = async (url = '', data = {}) => {
  const res = await fetch(`${process.env.BASE_URL}${url}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  const response = await res.json();
  response.ok = res.ok;
  response.status = res.status;
  response.statusText = res.statusText;
  return response;
};

export const getData = async (url = '', cookie) => {
  const res = await fetch(`${process.env.BASE_URL}${url}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: { cookie },
    credentials: 'same-origin',
    redirect: 'follow',
    referrer: 'no-referrer',
  });

  const response = await res.json();
  response.ok = res.ok;
  response.status = res.status;
  response.statusText = res.statusText;
  return response;
};
