import Pusher from 'pusher-js';
import express from 'express';

Pusher.logToConsole = true;
require('dotenv').config();

const pusher = new Pusher(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true,
});

let pusherData;

const channel = pusher.subscribe(process.env.PUSHER_CHANNEL);
channel.bind(process.env.PUSHER_EVENT, (data) => {
  console.log('Received weather report: ', data.message);
  pusherData = data.message; // save for later web requests
  if (process.env.OLED === 'true') {
    try {
      const oledExp = require('/usr/bin/node-oled-exp');
      oledExp.init();
      oledExp.clear();
      oledExp.setTextColumns();
      oledExp.setCursor(0, 0);
      oledExp.write(output);
    } catch (e) {
      console.log('Error with oled');
    }
  }
});

const app = express();
app.get('/', (req, res) => {
  if (!pusherData) {
    res.send('No data');
    return;
  }

  res.send(pusherData);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Express up on ${process.env.PORT || 3000}.`);
});
