export default class FetchOptions {
  constructor(method, fetchBody, headers, mode, cache) {
    this.method = method;
    this.body = method !== 'GET' ? JSON.stringify(fetchBody) : fetchBody;
    this.headers = headers;
    this.mode = mode || 'cors';
    this.cache = cache || 'default';
  }
}
