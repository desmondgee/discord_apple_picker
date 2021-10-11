module.exports = {
  displayName: 'Study Timer',
  pickerNames: [
    'study timer',
    'stt'
  ],
  async init(message) {
    Notice.success(channel, `Welcome to the Study Timer App`);
  }
}

