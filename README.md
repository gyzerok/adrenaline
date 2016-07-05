# Adrenaline

[![build status](https://img.shields.io/travis/gyzerok/adrenaline/master.svg?style=flat-square)](https://travis-ci.org/gyzerok/adrenaline)
[![npm version](https://img.shields.io/npm/v/adrenaline.svg?style=flat-square)](https://www.npmjs.com/package/adrenaline)
[![npm downloads](https://img.shields.io/npm/dm/adrenaline.svg?style=flat-square)](https://www.npmjs.com/package/adrenaline)

This library provides a subset of [Relay](https://github.com/facebook/relay)'s behaviour with a cleaner API.

## Why?

Relay is a great framework with exciting ideas behind it. The downside is that in order to get all the cool features, you need to deal with a complex API. Relay provides you a lot of tricky optimizations which probably are more suitable for huge projects. In small, medium and even large ones you would prefer to have better developer experience while working with a simple, minimalistic set of APIs.

Adrenaline intends to provide you Relay-like ability to describe your components with declarative data requirements, while keeping the API as simple as possible. You are free to use it with different libraries like Redux, React Router, etc.

## When not to use it?

- You have a huge project and highly need tricky optimisations to reduce client-server traffic.
- When you don't understand why you should prefer Adrenaline to Relay.

## Installation

`npm install --save adrenaline`

Adrenaline requires **React 15.0 or later.**

Adrenaline uses `fetch` under the hood so you need to install the [polyfill](https://github.com/github/fetch) by yourself.

`npm install --save whatwg-fetch`

and then import it at the very top of your entry JavaScript file:

```js
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Adrenaline } from 'adrenaline';

import App from './components/App';

ReactDOM.render(
  <Adrenaline>
    <App />
  </Adrenaline>,
  document.getElementById('root')
)
```

## API

Adrenaline follows the idea of [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.b5g7ctse2)

### `<Adrenaline endpoint />`

Root of your application should be wrapped with Adrenaline component. This component is a provider component which injects some helpful stuff into your React application.

prop name | type   | default/required | purpose
----------|--------|------------------|--------
endpoint  | string | "/graphql"       | URI of your GraphQL endpoint

### `container({ variables, query })(Component)`

In Adrenaline, you create container components mostly for your route handlers. The purpose of containers is to collect data requirements from presentation components in a single GraphQL query. They also behave like view controllers and are able to speak to the outside world using mutations.

key       | type                     | default/required | purpose
----------|--------------------------|------------------|--------
variables | (props: Props) => Object | () => ({})       | describe query variables as a pure function of props
query     | string                   | **required**     | your GraphQL query for this container


```javascript
import React, { Component, PropTypes } from 'react';
import { container } from 'adrenaline';
import TodoList from './TodoList';

class UserItem extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
  }
  /* ... */
}

export default container({
  variables: (props) => ({
    id: props.userId,
  }),
  query: `
    query ($id: ID!) {
      viewer(id: $id) {
        id,
        name,
        ${TodoList.getFragment('todos')}
      }
    }
  `,
})(UserItem);
```

Containers may also pass 2 additional properties to your component: `mutate` and `isFetching`.

* `mutate({ mutation: String, variables: Object = {}, invalidate: boolean = true }): Promise`: You need to use this function in order to perform mutations. `invalidate` argument means you need to resolve data declarations after mutation.
* `isFetching: boolean`: This property helps you understand if your component is in the middle of resolving data.

### `presenter({ fragments })(Component)`

As in the [presentational components idea](https://github.com/rackt/react-redux#dumb-components-are-unaware-of-redux), all your dumb components may be declared as simple React components. But if you want to declare your data requirements in a way similar to Relay, you can use the `presenter()` higher-order component.

```javascript
import React, { Component } from 'react';
import { presenter } from 'adrenaline';

class TodoList extends Component {
  /* ... */
}

export default presenter({
  fragments: {
    todos: `
      fragment on User {
        todos {
          id,
          text
        }
      }
    `,
  },
})(TodoList);
```


## Using ES7 decorators
Adrenaline works as higher-order components, so you can decorate your container components using ES7 decorators

```javascript
import { container } from 'adrenaline'

@container({
  variables: (props) => ({
    id: props.userId,
  }),
  query: `
    query ($id: ID!) {
      viewer(id: $id) {
        id,
        name,
        ${TodoList.getFragment('todos')}
      }
    }
  `
})
export default class extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
  }
  /* ... */
}
```


### Mutations

You can declare your mutations as simple as:

```javascript
const createTodo = `
  mutation ($text: String, $owner: ID) {
    createTodo(text: $text, owner: $owner) {
      id,
      text,
      owner {
        id
      }
    }
  }
`;
```

Then you can use this mutation with your component:

```javascript
import React, { Component, PropTypes } from 'react';
import { createSmartComponent } from 'adrenaline';

class UserItem extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
  }

  onSomeButtonClick() {
    this.props.mutate({
      mutation: createTodo,
      variables: {
        text: hello,
        owner: this.props.viewer.id
      },
    });
  }

  render() {
    /* render some stuff */
  }
}
```

### Testing

There is a common problem I've discovered so far while developing applications. When you change the GraphQL schema, you'd like to know which particular subtrees in your applications need to be fixed. And you probably do not want to check this by running your application and going through it by hand.

For this case, Adrenaline provides you helper utilities for integration testing (currently for `expect` only). You can use `toBeValidAgainst` for checking your components' data requirements against your schema with GraphQL validation mechanism.

```js
import expect from 'expect';
import TestUtils from 'adrenaline/lib/test';

import schema from 'path/to/schema';
// TodoApp is a container component
import TodoApp from 'path/to/TodoApp';

expect.extend(TestUtils.expect);

describe('Queries regression', () => {
  it('for TodoApp', () => {
    expect(TodoApp).toBeValidAgainst(schema);
  });
});
```

![Image](https://raw.githubusercontent.com/gyzerok/adrenaline/master/images/resgression-example.png)
