/* @flow */

import { reduce } from 'lodash';
import { GraphQLList, GraphQLObjectType, GraphQLScalarType } from 'graphql';

export default function parseSchema(schema) {
  const typeMap = schema.getTypeMap();
  const userTypes = reduce(typeMap, (acc, val, key) => {
    if (!isDefinedType(key)) return acc;
    return {
      ...acc,
      [key]: {
        ...reduce(val.getFields(), (memo, field, name) => {
          const typename = parseType(field.type, isDefinedType);
          return typename !== undefined ? { ...memo, [name]: typename } : memo;
        }, {}),
      },
    };
  }, {});
  return userTypes;
}

function parseType(type) {
  const complexType = (
    type instanceof GraphQLList ||
    type instanceof GraphQLScalarType ||
    type instanceof GraphQLObjectType
  );
  if (!complexType) return parseType(type.ofType);
  if (type instanceof GraphQLList) {
    const typename = type.ofType.name;
    return isDefinedType(typename) ? ([typename]) : undefined;
  }
  return isDefinedType(type.name) ? type.name : undefined;
}

function isDefinedType(typename) {
  return !isIntrospectionType(typename) && !isBuiltInScalar(typename);
}

function isIntrospectionType(typename) {
  return typename.indexOf('__') === 0;
}

function isBuiltInScalar(typename) {
  return (
    typename === 'String' ||
    typename === 'Boolean' ||
    typename === 'Int' ||
    typename === 'Float' ||
    typename === 'ID'
  );
}
