import getFilePath from '@utilities/getFilePath';

describe('getFilePath', () => {
  const sortArr: { url: string; path: string }[] = [
    {
      url: 'http://localhost:8090/images\\2019-11-08T07-13-10.728Z-bear.jpg',
      path: 'images\\2019-11-08T07-13-10.728Z-bear.jpg',
    },
    {
      url: 'http://localhost:8090/images\\2019-11-08T07-13-10.728Z-tiger.jpg',
      path: 'images\\2019-11-08T07-13-10.728Z-tiger.jpg',
    },
    {
      url: 'http://localhost:8090/images\\2019-11-08T07-13-10.728Z-wolf.jpg',
      path: 'images\\2019-11-08T07-13-10.728Z-wolf.jpg',
    },
    {
      url: 'http://localhost:8090/images\\2019-11-08T07-13-10.728Z-shark.jpg',
      path: 'images\\2019-11-08T07-13-10.728Z-shark.jpg',
    },
  ];

  it.each(sortArr)('should return the proper file path', ({ url, path }) => {
    expect.assertions(1);
    expect(getFilePath(url)).toMatch(path);
  });
});
