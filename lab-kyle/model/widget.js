'use strict';

const mongoose = require('mongoose');

const widgetSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  price: {type: Number, required: true},
  description: {type: String, required: true},
});

module.exports = mongoose.model('widget', widgetSchema);
