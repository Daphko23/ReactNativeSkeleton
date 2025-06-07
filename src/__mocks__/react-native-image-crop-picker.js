const ImagePicker = {
  openPicker: jest.fn(() => Promise.resolve({
    path: 'mock://path/to/image.jpg',
    sourceURL: 'mock://path/to/image.jpg',
    filename: 'image.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
    size: 100000,
    data: 'base64data',
  })),
  openCamera: jest.fn(() => Promise.resolve({
    path: 'mock://path/to/image.jpg',
    sourceURL: 'mock://path/to/image.jpg',
    filename: 'image.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
    size: 100000,
    data: 'base64data',
  })),
  openCropper: jest.fn(() => Promise.resolve({
    path: 'mock://path/to/image.jpg',
    sourceURL: 'mock://path/to/image.jpg',
    filename: 'image.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
    size: 100000,
    data: 'base64data',
  })),
  clean: jest.fn(() => Promise.resolve()),
  cleanSingle: jest.fn(() => Promise.resolve()),
};

export default ImagePicker; 