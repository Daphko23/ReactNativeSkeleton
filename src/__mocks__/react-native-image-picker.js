export const launchImageLibrary = jest.fn((options, callback) => {
  const response = {
    didCancel: false,
    errorMessage: null,
    assets: [{
      uri: 'mock://path/to/image.jpg',
      fileName: 'image.jpg',
      type: 'image/jpeg',
      fileSize: 100000,
      width: 300,
      height: 300,
    }],
  };
  
  if (callback) {
    callback(response);
  }
  return Promise.resolve(response);
});

export const launchCamera = jest.fn((options, callback) => {
  const response = {
    didCancel: false,
    errorMessage: null,
    assets: [{
      uri: 'mock://path/to/image.jpg',
      fileName: 'image.jpg',
      type: 'image/jpeg',
      fileSize: 100000,
      width: 300,
      height: 300,
    }],
  };
  
  if (callback) {
    callback(response);
  }
  return Promise.resolve(response);
});

export const MediaType = {
  photo: 'photo',
  video: 'video',
  mixed: 'mixed',
}; 