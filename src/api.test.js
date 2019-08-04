/* eslint-env jest */
import fetch from 'isomorphic-fetch';
import { postData, getData } from './api';

jest.mock('isomorphic-fetch');

const url = '/example';

describe('postData', async () => {
  const data = { test: 'data' };

  it('calls fetch with a post method', () => {
    postData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('uses CORS mode', () => {
    postData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        mode: 'cors',
      })
    );
  });

  it('uses no-cache', () => {
    postData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        cache: 'no-cache',
      })
    );
  });

  it('sends credentials when on the same origin', () => {
    postData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        credentials: 'same-origin',
      })
    );
  });

  it('sends data with application/json Content-Type', () => {
    postData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('always follows redirects', () => {
    postData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        redirect: 'follow',
      })
    );
  });

  it('enforces no-referrer', () => {
    postData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        referrer: 'no-referrer',
      })
    );
  });

  it('calls fetch with passed in url', () => {
    postData(url);
    expect(fetch).toBeCalledWith(
      expect.stringContaining(url),
      expect.any(Object)
    );
  });

  it('stringifies JSON before sending', () => {
    postData(url, data);
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify(data),
      })
    );
  });
});

describe('getData', async () => {
  const cookie = 'some-string';

  it('calls fetch with a get method', () => {
    getData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('uses CORS mode', () => {
    getData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        mode: 'cors',
      })
    );
  });

  it('uses no-cache', () => {
    getData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        cache: 'no-cache',
      })
    );
  });

  it('sends credentials when on the same origin', () => {
    getData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        credentials: 'same-origin',
      })
    );
  });

  it('always follows redirects', () => {
    getData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        redirect: 'follow',
      })
    );
  });

  it('enforces no-referrer', () => {
    getData();
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        referrer: 'no-referrer',
      })
    );
  });

  it('calls fetch with passed in url', () => {
    getData(url);
    expect(fetch).toBeCalledWith(
      expect.stringContaining(url),
      expect.any(Object)
    );
  });

  it('sends credentials via a cookie', () => {
    getData(url, cookie);
    expect(fetch).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          cookie,
        },
      })
    );
  });
});
