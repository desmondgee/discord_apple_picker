global.__basedir = __dirname;

require('dotenv').config();

const ApplePicker = require('./shared_library/applePicker');
new ApplePicker();
