import { parse, validate } from 'graphql';

export default {
  toBeValidAgainst(schema) {
    const specs = this.actual.getSpecs();
    const errors = validate(schema, parse(specs.query));

    if (errors.length === 0) return this;

    throw errors[0];
  },
};
