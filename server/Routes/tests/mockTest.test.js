'use strict';
import { jest } from '@jest/globals';

import * as mocker from '../mocker.js';

mocker.toSure = testFucn;
function testFucn() {
  console.log('test func called');
}

mocker.toSure();

// describe('Testing the mock functionality', () => {
//   test('should mock pleaseBeMocked', () => {
//     const value = mocker();
//     console.log('Value: ', value);

//     expect(value).toBeUndefined();
//   });
// });
