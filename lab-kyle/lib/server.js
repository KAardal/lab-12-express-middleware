'use strict';

const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const app = express();
let server;
const serverControl = module.exports = {};

// TODO: add routes

// TODO: add middleware

serverControl.start = () => {
  return new Promise(function(resolve, reject) {
    if(!server || !server.isOn) {
      server = app.listen(process.env.PORT, () => {
        console.log('server is up on', process.env.PORT);
        server.isOn = true;
        return resolve();
      });
    }
    reject();
  });
};

serverControl.stop = () => {
  return new Promise(function(resolve, reject) {
    if(server && server.isOn) {
      server.close(process.env.PORT, () => {
        console.log('server is down');
        server.isOn = false;
        return resolve();
      });
    }
    reject();
  });
};
