/* @flow */

import { join } from 'path';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import multer from 'multer';
import { reduce } from 'lodash';
import schema from '../shared/schema';
import * as conn from './data';

const app = express();

const publicPath = join(__dirname, '..', '..', '.tmp');
app.use(express.static(publicPath));
app.use(multer({ dest: './uploads' }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'file', maxCount: 1 },
  { name: 'files', maxCount: 10 },
]));

function handleFiles(req, res, next) {
  if (req.files) {
    const { variables } = req.body;
    const preparedFiles = reduce(req.files, (acc, val, key) => {
      if (key === 'image' || key === 'file') {
        return {
          ...acc,
          [key]: val[0].path,
        };
      }
      else {
        return {
          ...acc,
          [key]: val.map(v => v.path),
        };
      }
    }, {});
    req.body.variables = JSON.stringify({
      ...JSON.parse(variables),
      ...preparedFiles,
    });
  }
  next();
}

app.use('/graphql', handleFiles, graphqlHTTP({
  schema,
  rootValue: conn,
}));

const serverPort = process.env.PORT || 1337;
const server = app.listen(serverPort, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Listening at http://%s:%s', host, port); // eslint-disable-line no-console
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title></title>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/javascript" src="bundle.js"></script>
      </body>
    </html>
  `);
});
