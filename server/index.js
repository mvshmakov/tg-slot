require('dotenv').config();

const bot = require('./bot');
require('./express')(bot);
