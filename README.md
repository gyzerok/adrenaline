# redux-graphql

[![Build Status](https://travis-ci.org/gyzerok/redux-graphql.svg)](https://travis-ci.org/gyzerok/redux-graphql)
[![Code Climate](https://codeclimate.com/github/gyzerok/redux-graphql/badges/gpa.svg)](https://codeclimate.com/github/gyzerok/redux-graphql)

This is a pack of tools which provides Relay-like functionality for Redux-based applications.

You can check [this repository](https://github.com/gyzerok/redux-react-graphql-example) to see a dirty working example of Todo app.

***NOTE:*** Currently this is nothing but proof of concept. Project is in the very early stage.

## Example

As you can see from following example its somelike close to [Relay examples provided by Facebook](http://facebook.github.io/react/blog/2015/03/19/building-the-facebook-news-feed-with-relay.html).

```javascript
// ./index.js

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createReducer } from 'redux-graphql';
import App from './components/App';

const reducer = combineReducers({
  graphql: createReducer(),
});
const finalCreateStore = applyMiddleware(thunk)(createStore);
const store = finalCreateStore(reducer);

const rootNode = document.getElementById('root');
React.render(
  <Provider store={store}>
    {() => <App endpoint="/graphql" />}
  </Provider>,
  rootNode
);

```

```javascript
// ./componenets/App.jsx

import React, { Component, PropTypes } from 'react';
import TodoList from './TodoList';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GraphQLConnector } from 'redux-graphql';

@connect(state => state)
export default class App extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    graphql: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  render() {
    const { endpoint, graphql, dispatch } = this.props;

    return (
      <GraphQLConnector endpoint={endpoint} dispatch={dispatch}>
        <TodoList {...graphql} />
      </GraphQLConnector>
    );
  }
}
```

```javascript
// ./components/TodoItem.jsx

import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import { createGraphQLContainer as createContainer } from 'redux-graphql';

class TodoList extends Component {
  static propTypes = {
    todos: PropTypes.array,
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.todos.map(todo =>
            <TodoItem todo={todo} />
          )}
        </ul>
      </div>
    );
  }
}

export default createContainer(TodoList, {
  queryParams: {
    count: 5,
  },
  queries: {
    todos: `
      todos(count: <count>) {
        ${TodoItem.getQuery('todo')}
      }
    `,
  },
});
```

```javascript
// ./componeents/TodoList.jsx

import React, { Component, PropTypes } from 'react';
import { createGraphQLContainer as createContainer } from 'redux-graphql';

class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.object.isRequired,
  }

  render() {
    return (
      <li>{this.props.todo.text}</li>
    );
  }
}

export default createContainer(TodoItem, {
  queries: {
    todo: `
      ... on Todo {
        text
      }
    `,
  },
});
```
