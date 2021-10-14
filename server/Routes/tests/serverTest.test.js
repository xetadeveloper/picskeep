describe('API routes tests', () => {
  console.log('Starting Tests...');
  test('Should return status 200 for api/test route', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toBe(200);
    return;
  }, 100000);

  test('The response data should equal (Working) for api/test route', async () => {
    const res = await request(app).get('/api/test');
    expect(res.text).toBe('Working');
    return;
  }, 100000);

  test('Content type should be text/html for api/test route', async () => {
    const res = await request(app).get('/api/test');
    expect(res.type).toEqual('text/html');
    return;
  }, 100000);
});
