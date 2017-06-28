'use strict';

const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const app = express();
let server;
const serverControl = module.exports = {};


app.use(require('../route/widget-router.js'));
app.use(require('./error-middleware.js'));

serverControl.start = () => {
  return new Promise((resolve, reject) => {
    if(!server || !server.isOn) {
      server = app.listen(process.env.PORT, () => {
        console.log('server is up on', process.env.PORT);
        server.isOn = true;
        resolve();
      });
      return;
    }
    reject();
  });
};

serverControl.stop = () => {
  return new Promise((resolve, reject) => {
    if(server && server.isOn) {
      server.close(() => {
        console.log('server is down');
        server.isOn = false;
        resolve();
      });
      return;
    }
    reject();
  });
};
