/* @flow */

import { reduce } from 'lodash';
import { GraphQLList, GraphQLObjectType, GraphQLScalarType } from 'graphql';
import isDefinedType from './isDefinedType';

export function parseSchema(schema) {
  const typeMap = schema.getTypeMap();
  const userTypes = reduce(typeMap, (acc, val, key) => {
    if (!isDefinedType(key)) return acc;
    return {
      ...acc,
      [key]: {
        ...reduce(val.getFields(), (memo, field, name) => {
          const typename = parseType(field.type);
          return typename !== 'Scalar' ? { ...memo, [name]: typename } : memo;
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
    return isDefinedType(typename) ? ([typename]) : 'Scalar';
  }
  return isDefinedType(type.name) ? type.name : 'Scalar';
}
