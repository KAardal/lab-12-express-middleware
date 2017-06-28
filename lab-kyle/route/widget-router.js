'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Widget = require('../model/widget.js');

const widgetRouter = module.exports = new Router();

widgetRouter.post('/api/widgets', jsonParser, (req, res, next) => {
  console.log('POST api/widgets');

  new Widget(req.body)
  .save()
  .then(widget => res.json(widget))
  .catch(next);
});

widgetRouter.get('/api/widgets/:id', (req, res, next) => {
  console.log('Get api/widgets/:id');

  Widget.findById(req.params.id)
  .then(widget => res.json(widget))
  .catch(next);
});

widgetRouter.put('/api/widgets/:id', jsonParser, (req, res, next) => {
  console.log('hit PUT api/widgets/:id');

  let options = {
    runValidators: true,
    new: true,
  };

  Widget.findByIdAndUpdate(req.params.id, req.body, options)
  .then(widget => res.json(widget))
  .catch((err) => {
    next(err);
  });
});

widgetRouter.delete('/api/widgets/:id', (req, res, next) => {
  console.log('hit DELETE api/widgets/:id');

  Widget.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
