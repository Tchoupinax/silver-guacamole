const express = require('express');
const app = express();
const crypto = require('crypto');

const PORT = 4030;
const LINKS = new Map();

app.get('/', (req, res) => res.send('OK'));

app.use(express.json());

app.post('/link', (req, res) => {
  const token = crypto.randomBytes(20).toString('hex');

  LINKS.set(token, req.body.url);

  return res.json({
    status: 'success',
    code: 200,
    data: {
      token,
      url: `http://localhost:${PORT}/link/${token}`,
    },
  });
});

app.get('/link/:token', (req, res) => {
  const token = req.params.token;

  const url = LINKS.get(token);

  return res.send(url);
});

app.listen(4030);
