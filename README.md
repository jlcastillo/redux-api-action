# redux-api-action

Send HTTP requests to an API server, automatically dispatching actions with the result.


## How it works
```js
npm install redux-api-action --save
```

#### actions.js

```js
import { createApiAction } from 'redux-api-action'
export const apiAuth = createApiAction('https://your.api.server.com', 'POST', '/api/auth')
```

#### component.js
Arguments to the api action wil be sent in the body of the HTTP request.
```js
import { apiAuth } from 'actions'

const SubmitComponent = ({ apiAuth }) =>
    <button onClick={() => apiAuth({body: {user: 'foo', password: 'oof'}})}>
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

redux-api-action relies on  [redux-api-middleware](https://github.com/agraboso/redux-api-middleware) and [redux-thunk](https://github.com/reduxjs/redux-thunk):

```js
npm install redux-api-middleware redux-thunk --save

```

#### configureStore.js

```js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import reducers from './reducers';

const reducer = combineReducers({...reducers, api: (state=null, action) => state});
const createStoreWithMiddleware = applyMiddleware(thunk, apiMiddleware)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
```

## Authentication

If the redux store contains a token at *state.auth.token*, all HTTP requests will be sent with the header 'Authorization' = 'Bearer '+ *state.auth.token*.

## Query Strings

To POST to an endpoint using /api/auth?jwt=true

```js
// declare the API
export const apiAuth = createApiAction('https://your.api.server.com', 'POST', '/api/auth')
...
// dispatch it (assumming you wrapped it in mapDispatchToProps)
apiAuth({query: {jwt: true}, body: {user: 'foo', password: 'oof'}})
```

## Interpolated Params

To POST to an endpoint using /api/:id/auth

```js
// declare the API
export const apiAuth = createApiAction('https://your.api.server.com', 'POST', '/api/:id/auth')
...
// dispatch it (assumming you wrapped it in mapDispatchToProps)
apiAuth({params: {id: '1234'}, body: {user: 'foo', password: 'oof'}})
```

## Callbacks

Usually you will connect to the redux store to get data retrieved from the API, but there may be situations where you need to run some tasks as a result of an API call and you don't want to mess with redux. You can provide *onSuccess* and/or *onError* callbacks as options: 

```js
// declare the API
export const apiAuth = createApiAction('https://your.api.server.com', 'POST', '/api/:id/auth')
...
// dispatch it (assumming you wrapped it in mapDispatchToProps)
apiAuth({body: {user: 'foo', password: 'oof'}}, onSuccess: (resp) => console.log(resp), onError: (resp) => console.error(resp))
```

## Authors

* **Jose Luis Castillo** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* the authors of redux-api-middleware for their great library

