import { convertCamelCase, removeNull } from './utils';

describe('tests for removing null values', () => {
  test('should remove address which is null from object', () => {
    const obj = {
      name: 'Ade',
      age: 57,
      address: null,
    };
    expect(removeNull(obj)).toEqual({ name: 'Ade', age: 57 });
  });

  test('should remove null address and empty email from object', () => {
    const obj = {
      name: 'Ade',
      age: 57,
      address: 'null',
      email: '',
    };
    expect(removeNull(obj)).toEqual({ name: 'Ade', age: 57 });
  });

  test('should remove null address and undefined email from object', () => {
    const obj = {
      name: 'Ade',
      age: 57,
      address: null,
      email: undefined,
    };
    expect(removeNull(obj)).toEqual({ name: 'Ade', age: 57 });
  });

  test('should not remove false good from object', () => {
    const obj = {
      name: 'Ade',
      age: 57,
      good: false,
    };
    expect(removeNull(obj)).toEqual({ name: 'Ade', age: 57, good: false });
  });
});

describe('tests for converting to camel case', () => {
  test('should convert word to Word', () => {
    expect(convertCamelCase('word')).toBe('Word');
  });

  test('should convert bind to Bind', () => {
    expect(convertCamelCase('word')).toBe('Word');
  });

  test('should convert sean to Sean', () => {
    expect(convertCamelCase('word')).toBe('Word');
  });
});
