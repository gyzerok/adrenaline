import { join } from 'path';
import express from 'express';
import { json as jsonParser } from 'body-parser';

/********************************************/
/*                 SERVER                   */
/********************************************/

const app = express();

const publicPath = join(__dirname, '..', '.tmp');
app.use(express.static(publicPath));

app.use(jsonParser());

const serverPort = process.env.PORT || 1337;
const server = app.listen(serverPort, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});

/********************************************/
/*                   API                    */
/********************************************/


import { graphql } from 'graphql';
import schema from '../shared/schema';
import * as conn from './data';

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

app.post('/graphql', (req, res) => {
  const { query } = req.body;

  graphql(schema, query, conn)
    .then(result => {
      if (result.errors) {
        res.status(400);
      }
      res.json(result);
    });
});
