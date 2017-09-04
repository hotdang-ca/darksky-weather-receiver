'use strict';

var _pusherJs = require('pusher-js');

var _pusherJs2 = _interopRequireDefault(_pusherJs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_pusherJs2.default.logToConsole = true;
require('dotenv').config();

var pusher = new _pusherJs2.default(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

var pusherData = void 0;

var channel = pusher.subscribe(process.env.PUSHER_CHANNEL);
channel.bind(process.env.PUSHER_EVENT, function (data) {
  console.log('Received weather report: ', data.message);
  pusherData = data.message; // save for later web requests
  if (process.env.OLED === 'true') {
    try {
      var oledExp = require('/usr/bin/node-oled-exp');
      oledExp.init();
      oledExp.clear();
      oledExp.setTextColumns();
      oledExp.setCursor(0, 0);
      oledExp.write(pusherData);
    } catch (e) {
      console.log('Error with oled', e);
    }
  }
});

var app = (0, _express2.default)();
app.get('/', function (req, res) {
  if (!pusherData) {
    res.send('No data');
    return;
  }

  res.send(pusherData);
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Express up on ' + (process.env.PORT || 3000) + '.');
});
