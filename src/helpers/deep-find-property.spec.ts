import { deepFindProperty } from './deep-find-property';

describe('deepFindProperty', () => {
  let obj: any;

  beforeEach(() => {
    obj = {
      a: {
        b: {
          c: 'result',
        },
      },
      x: {
        y: false,
        z: 0,
        w: '',
        q: null,
      },
      arr: [
        { inArr: 1 },
        { inArr: 2 },
      ],
      flat: 'flat result',
    };
  });

  it('should return correct result', () => {
    expect.hasAssertions();
    expect(deepFindProperty<string>(obj, 'a.b.c')).toBe('result');
    expect(deepFindProperty<string>(obj, 'flat')).toBe('flat result');
  });

  it('should return null if value not exist', () => {
    expect.hasAssertions();
    expect(deepFindProperty(obj, 'a.b.d')).toBeNull();
    expect(deepFindProperty(obj, 'a.b.d.g')).toBeNull();
  });

  it('should return correct result if value is falsy', () => {
    expect.hasAssertions();
    expect(deepFindProperty<boolean>(obj, 'x.y')).toBe(false);
    expect(deepFindProperty<number>(obj, 'x.z')).toBe(0);
    expect(deepFindProperty<string>(obj, 'x.w')).toBe('');
    expect(deepFindProperty<null>(obj, 'x.q')).toBeNull();
  });

  it('should return result with alternative separator', () => {
    expect.hasAssertions();
    expect(deepFindProperty<string>(obj, 'a$$$b$$$c', '$$$')).toBe('result');
  });

  it('should return correct result if value is in array notation', () => {
    expect.hasAssertions();
    expect(deepFindProperty<boolean>(obj, 'arr[1].inArr')).toBe(2);
    expect(deepFindProperty<boolean>(obj, 'arr[1]')).toStrictEqual({ inArr: 2 });
  });
});
