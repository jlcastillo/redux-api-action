# redux-api-action

Send HTTP requests to an API server, automatically dispatching actions with the result.


## How it works
```js
npm install redux-api-action --save
```

#### actions.js

```js
import { createApiAction } from 'redux-api-action'
export const apiAuth = createApiAction('POST', '/api/auth')
```

#### component.js
Arguments to the api action wil be sent in the body of the HTTP request.
```js
import { apiAuth } from 'actions'

const SubmitComponent = ({ apiAuth }) =>
    <button onClick={() => apiAuth({user: 'foo', password: 'oof'})}>
        Submit
    </button>

export default connect(null, { apiAuth })(SubmitComponent)
```

#### reducers.js
```js
import { apiAuth } from 'actions'

export default (state = [], { type, payload, ...action }) => {
  switch(type) {
    case apiAuth.types.request: {
        if(action.error)
            // API call timed out
        else
            // API call just sent, response not received yet
    }
    case apiAuth.types.success: {
      // API call succeeded, response comes in 'payload'
    }
    case apiAuth.types.failure: {
        // API answered with an error, status in 'payload.status'
    }
    default:
      return state;
  }
}
```
 
## Prerequisites

redux-api-action relies on  [redux-api-middleware](https://github.com/agraboso/redux-api-middleware):

```js
npm install redux-api-middleware --save

```

#### configureStore.js

```js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import reducers from './reducers';

const reducer = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(apiMiddleware)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
```

#### app.js

```js
const store = configureStore({...initialState, {api: {baseUrl: 'https://your.api.server.com'}}});
```

## Authentication

If the redux store contains a token at *state.auth.token*, all HTTP requests will be sent with the header 'Authorization' = 'Bearer '+ *state.auth.token*.

## Future Work

* Support query strings (i.e. '/api/users?id=1234')
* Support parametrized endpoints (i.e. '/api/users/:id)


## Authors

* **Jose Luis Castillo** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* the authors of redux-api-middleware for their great library

