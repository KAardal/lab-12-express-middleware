'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

const expect = require('expect');
const superagent = require('superagent');

const Widget = require('../model/widget.js');
const server = require('../lib/server.js');

const API_URL = process.env.API_URL;

describe('testing widget router', () => {
  before(server.start);
  after(server.stop);

  describe('testing POST api/widgets', () => {
    after(() => Widget.remove({}));
    let data = {
      name: 'Foo',
      price: 1.99,
      description: 'Bar',
    };

    it('should respond with a widget and 200 status', () => {
      return superagent.post(`${API_URL}/api/widgets`)
       .send(data)
       .then(res => {
         expect(res.status).toEqual(200);
         expect(res.body._id).toExist();
         expect(res.body.name).toEqual(data.name);
         expect(res.body.price).toEqual(data.price);
         expect(res.body.description).toEqual(data.description);
       });
    });

    it('should respond with a 400', () => {
      return superagent.post(`${API_URL}/api/widgets`)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });

    // TODO: write the rest of 400 tests

    it('should respond with a 409', () => {
      return superagent.post(`${API_URL}/api/widgets`)
      .send(data)
      .catch(res => {
        expect(res.status).toEqual(409);
      });
    });
  });

  describe('testing GET /api/widgets/:id', () => {
    var temp;

    beforeEach(() => {
      return new Widget({
        name: 'some name',
        price: 10,
        description: 'stuff',
      })
      .save()
      .then(widget => temp = widget);
    });
    afterEach(() => Widget.remove({}));

    it('should respond with a widget', () => {
      return superagent.get(`${API_URL}/api/widgets/${temp._id}`)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(temp._id);
        expect(res.body.name).toEqual(temp.name);
        expect(res.body.price).toEqual(temp.price);
        expect(res.body.description).toEqual(temp.description);
      });
    });

    it('should respond with 404', () => {
      return superagent.get(`${API_URL}/api/widgets/5952dba4ee50a87192182f6d`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });

  describe('testing PUT /api/widgets/:id', () => {
    var temp;

    beforeEach(() => {
      return new Widget({
        name: 'some name',
        price: 11,
        description: 'stuff',
      })
      .save()
      .then(widget => temp = widget);
    });
    afterEach(() => Widget.remove({}));

    it('should respond with a widget', () => {
      let updated = {
        name: 'different name',
        price: 10,
        description: 'new stuff',
      };
      return superagent.put(`${API_URL}/api/widgets/${temp._id}`)
      .send(updated)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(temp._id);
        expect(res.body.name).toEqual(updated.name);
        expect(res.body.price).toEqual(updated.price);
        expect(res.body.description).toEqual(updated.description);
      });
    });

    it('should respond with 400', () => {
      let updated = {wrong: 'bad'};
      return superagent.put(`${API_URL}/api/widgets/${temp._id}`)
      .send(updated)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });

    it('should respond with 404', () => {
      return superagent.put(`${API_URL}/api/widgets/5952dba4ee50a871kjhkjh6d`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });

  describe('testing DELETE /api/widgets/:id', () => {
    var temp;

    afterEach(() => Widget.remove({}));
    beforeEach(() => {
      return new Widget({
        name: 'Foo',
        price: 12,
        description: 'Bar',
      })
      .save()
      .then(widget => {
        temp = widget;
      });
    });

    it('should delete a widget and respond 204', () => {
      return superagent.delete(`${API_URL}/api/widgets/${temp._id}`)
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });

    it('bad id should respond with a 404', () => {
      return superagent.delete(`${API_URL}/api/widgets/5952a8d5c1b8d566a64ea23f`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });
});
