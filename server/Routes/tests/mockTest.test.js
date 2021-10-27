import * as mocker from '../mocker.js';
import { jest } from '@jest/globals';

jest.doMock('../mocker.js', () => {
  return {
    pleaseBeMocked: jest.fn(() => 'I am mocked!!'),
  };
});


describe('Testing the mock functionality', () => {
  test('should mock pleaseBeMocked', () => {
    const value = mocker.pleaseBeMocked();
    console.log('Value: ', value);

    expect(value).toBe('I am mocked!!');
  });
});
