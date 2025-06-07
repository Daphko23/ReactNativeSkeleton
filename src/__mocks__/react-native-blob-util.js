const RNFetchBlob = {
  fs: {
    readFile: jest.fn(() => Promise.resolve('base64-data')),
    writeFile: jest.fn(() => Promise.resolve()),
    stat: jest.fn(() => Promise.resolve({ size: 100000 })),
    exists: jest.fn(() => Promise.resolve(true)),
    unlink: jest.fn(() => Promise.resolve()),
    dirs: {
      DocumentDir: '/mocked/document/dir',
      CacheDir: '/mocked/cache/dir',
      DownloadDir: '/mocked/download/dir',
    },
  },
  config: jest.fn(() => ({
    fetch: jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob()),
    })),
  })),
  fetch: jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
  })),
};

export default RNFetchBlob; 