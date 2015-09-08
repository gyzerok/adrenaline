/* @flow */

import { join } from 'path';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from '../shared/schema';
import * as conn from './data';

const app = express();

const publicPath = join(__dirname, '..', '..', '.tmp');
app.use(express.static(publicPath));

app.use('/graphql', graphqlHTTP({
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
