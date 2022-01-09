import 'chai-http';
import * as chai from 'chai';
chai.use(require('chai-http'));

import { describe, it, expect } from 'vitest';

export function testEach(cases) {
  return (name, fn) => {
    cases.forEach(items => {
      it(`[${items[0]},${items[1]}] - ${name}`, () => fn(...items));
    });
  };
}

const languages = [
  ['GO', 4010],
  ['RUST', 4020],
];

describe('home', () => {
  testEach(languages)('should return OK with GET request %i', async (name, port) => {
    const path = `http://localhost:${port}`;

    const res = await chai.request(path).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });
});

describe('post and get', () => {
  testEach(languages)('should create and recover a link (https://www.google.fr)', async (name, port) => {
    const path = `http://localhost:${port}`;

    const res = await chai
      .request(path)
      .post('/link')
      .send({
        url: 'https://www.google.fr',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.token, 'res.body.data.token').not.toBeUndefined();

    const token = res.body.data.token;
    expect(res.body.status).toBe('success');
    expect(res.body.code).toBe(200);
    expect(res.body.data.token).toBe(token);
    expect(res.body.data.url).toBe(`${path}/link/${token}`);

    const get = await chai
      .request(path)
      .get(`/link/${res.body.data.token}`);

    expect(get.status).toBe(200);
    expect(get.text).toBe('https://www.google.fr');
  });

  testEach(languages)('should create and recover a link (https://github.com)', async (name, port) => {
    const path = `http://localhost:${port}`;

    const res = await chai
      .request(path)
      .post('/link')
      .send({
        url: 'https://github.com',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.token, 'res.body.data.token').not.toBeUndefined();

    const token = res.body.data.token;
    expect(res.body.status).toBe('success');
    expect(res.body.code).toBe(200);
    expect(res.body.data.token).toBe(token);
    expect(res.body.data.url).toBe(`${path}/link/${token}`);

    const get = await chai
      .request(path)
      .get(`/link/${res.body.data.token}`);

    expect(get.status).toBe(200);
    expect(get.text).toBe('https://github.com');
  });
});
