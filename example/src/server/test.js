import { graphql } from 'graphql';
import normalize from '../../../src/utils/normalize';
import parseSchema from '../../../src/utils/parseSchema';
import schema from '../shared/schema';
import * as conn from './data';

const query = `
  mutation TestMutation {
    createTodo(text: "hello world") {
      id,
      text
    }
  }
`;

graphql(schema, query, conn)
  .then(res => {
    const normalized = normalize(parseSchema(schema), res.data);
    console.log(normalized);
  })
  .catch(err => console.error(err, err.stack));
