/* @flow */

import { reduce } from 'lodash';
import { GraphQLList, GraphQLNonNull, GraphQLScalarType } from 'graphql';

export default function parseSchema(schema) {
  const typeMap = schema.getTypeMap();
  const userTypes = reduce(typeMap, (acc, val, key) => {
    if (key.startsWith('__')) return acc;
    if (isScalar(val)) return acc;
    console.log(val, isScalar(val));
    return {
      ...acc,
      [key]: {
        ...reduce(val.getFields(), (memo, field, name) => {
          const typename = parseType(field.type);
          return typename !== undefined ? { ...memo, [name]: typename } : memo;
        }, {}),
      },
    };
  }, {});
  return userTypes;
}

function parseType(type) {
  if (isDefined(type)) return type.name;
  if (isComplex(type)) return parseType(type.ofType);
  if (isList(type)) {
    const typename = type.ofType.name;
    return isDefined(typename) ? ([typename]) : undefined;
  }

  return undefined;
}

function isComplex(type) {
  return type instanceof GraphQLNonNull;
}

function isList(type) {
  return type instanceof GraphQLList;
}

function isScalar(type) {
  return type instanceof GraphQLScalarType;
}

function isDefined(type) {
  return !(
    isList(type) ||
    isComplex(type) ||
    isScalar(type)
  );
}
