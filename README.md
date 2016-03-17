# Adrenaline

[![build status](https://img.shields.io/travis/gyzerok/adrenaline/master.svg?style=flat-square)](https://travis-ci.org/gyzerok/adrenaline)
[![npm version](https://img.shields.io/npm/v/adrenaline.svg?style=flat-square)](https://www.npmjs.com/package/adrenaline)
[![npm downloads](https://img.shields.io/npm/dm/adrenaline.svg?style=flat-square)](https://www.npmjs.com/package/adrenaline)

This library provides subset of [Relay](https://github.com/facebook/relay) behaviour with a cleaner API.

## Why?

Relay is a great framework with exiting ideas behind it. The downside is that in order to get all cool features of one you need to deal with complex API. Relay provides you a lot of tricky optimistions which probably are more suitable for huge projects. In small, medium and even large ones you would prefer to have better DX while working with a simple minimalistic set of APIs.

Adrenaline intend to provide you Relay-like ability to describe your components with declarative data requirements, while keeping API as simple as possible. You are free to use it with different libraries like Redux, React Router and etc.

## When not use it?

- You have a huge project and highly need tricky optimisations to reduce client-server traffic.
- When you don't understand why should you prefer Adrenaline to Relay.

## Installation

`npm install --save adrenaline`

Adrenaline requires **React 0.14 or later.**

Adrenaline uses `fetch` under the hood so you need to install [polyfill](https://github.com/github/fetch) by yourself.

## API

Adrenaline follows the idea of [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.b5g7ctse2)

### `<Adrenaline endpoint />`

Root of your application should be wrapped with Adrenaline component.

#### Props

* `endpoint`: URI of your GraphQL endpoint. Defaults to `/graphql`.

### `presenter({ fragments })(Component)`

As in [presentational components idea](https://github.com/rackt/react-redux#dumb-components-are-unaware-of-redux) all your dumb components may be declared as simple React components. But if you want to declare your data requirements in similar to Relay way you can use `createDumbComponent` function.

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
})(Component);
```

### `container({ variables, queries })(Component)`

This function is the main building block for your application. It is similar to [react-redux smart component](https://github.com/rackt/react-redux#smart-components-are-connect-ed-to-redux) but with ability to declare your data query with GraphQL.

  - `Component`: Its your component which would be wrapped.
  - `initialVariables`: Optional. This is an are your arguments which would be applied to your query. You can declare it as a plain object or as a function of props. When variables have changed, your component will need to notify adrenaline by invoking this.setVariables(variables).
  - `variables`: Optional. An alternative to 'initialVariables', defined as a pure function of your props. Adrenaline will manage prop updates and refresh your query requirements as props change. function(props) should return an object of query variables.
  - `query`: Your GraphQL query string.
  - `mutations`: Your mutations which would be binded to dispatch.


```javascript
import React, { Component, PropTypes } from 'react';
import { createSmartComponent } from 'adrenaline';
import TodoList from './TodoList';

class UserItem extends Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
  }
  /* ... */
}

// With initialVariables as a plain object
export default createSmartComponent(UserItem, {
  initialVariables: {
    id: 1,
  },
  query: `
    query Q($id: ID!) {
      viewer(id: $id) {
        id,
        name,
        ${TodoList.getFragment('todos')}
      }
    }
  `,
});

// Or with initialVariables as a function of props
export default createSmartComponent(UserItem, {
  initialVariables: (props) => ({
    id: props.userId,
  }),
  query: `
    query Q($id: ID!) {
      viewer(id: $id) {
        id,
        name,
        ${TodoList.getFragment('todos')}
      }
    }
  `,
});

// Or with variables as a function of props
export default createSmartComponent(UserItem, {
  variables: (props) => ({
    id: props.userId,
  }),
  query: `
    query Q($id: ID!) {
      viewer(id: $id) {
        id,
        name,
        ${TodoList.getFragment('todos')}
      }
    }
  `,
});
```

### Mutations

Mutations should be declared as a plain objects. Simple mutation can be declared in the following way:
```javascript
const createTodo = {
  mutation: `
    mutation YourMutationName($text: String, $owner: ID) {
      createTodo(text: $text, owner: $owner) {
        id,
        text,
        owner {
          id
        }
      }
    }
  `,
}
```
Then you can use this mutation with your component
```javascript
import React, { Component, PropTypes } from 'react';
import { createSmartComponent } from 'adrenaline';

class UserItem extends Component {
  static propTypes = {
    mutations: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  }

  onSomeButtonClick() {
    this.props.mutations.createTodo({
      text: 'Hello, World',
      owner: this.props.viewer.id,
    });
  }
}

const createTodo = /* ... */

export default createSmartComponent(UserItem, {
  initialVariables: (props) => ({
    id: props.userId,
  }),
  query: `
    query Q($id: ID!) {
      viewer(id: $id) {
        id,
        name,
        todos {
          ${TodoList.getFragment('todos')}
        }
      }
    }
  `,
  mutations: {
    createTodo,
  },
});
```

But sometimes you need to update some references in order to make your client data consistent. Thats why there is an `updateCache` property which stands for an array of actions which need to be done in order to make data consistent. Those actions are quite similar to reducers. They have to return state pieces to update internal cache.
```javascript
const createTodo = {
  mutation: `
    mutation YourMutationName($text: String, $owner: ID) {
      createTodo(text: $text, owner: $owner) {
        id,
        text,
        owner {
          id
        }
      }
    }
  `,
  updateCache: [
    (todo) => ({
      parentId: todo.owner.id,
      parentType: 'Todo',
      resolve: (parent) => {
        return {
          ...parent,
          todos: parent.todos.concat([todo.id]),
        };
      },
    })
  ],
}
```
