# Adrenaline

[![Build Status](https://travis-ci.org/gyzerok/adrenaline.svg?branch=master)](https://travis-ci.org/gyzerok/adrenaline)
[![Code Climate](https://codeclimate.com/github/gyzerok/redux-graphql/badges/gpa.svg)](https://codeclimate.com/github/gyzerok/redux-graphql)

This was started as a pack of tools for Redux to work with GraphQL (before Relay release) but have transformed into a Relay-like framework. Motivation: I do not like Relay in most cases and want to share the same idea with different more clean API.

## Status

Currently I'm working hard for the 1.0 release which gonna be public. If anyone want to help please note me in issues.

## Way to 1.0
 - Mutations
 - Queries batching
 - Default middlware for express
 - Isomorphism
 - Allow to specify starting params for component via props
 - Memoize fieldASTs to reduce overhead for query parsing
 - Move all to Redux as a deps to prevent implementing same things
 - Move all query sending into Adrenaline component?
 - Somehow solve nessesity of implementing cache resolve in the GraphQL schema
