const RSAA = require('redux-api-middleware').RSAA;

let baseUrl = "";

// Generic description for an API call
exports.createApiAction = (method, endpoint) => {
    let actionName = `[${method}]${endpoint}`;
    let types = {
        request: actionName + '_REQUEST', 
        success: actionName + '_SUCCESS', 
        failure: actionName + '_FAILURE'
    }

    let actionCreator = (options) => async (dispatch, getState) => {
        let apiBaseUrl = getState().api.baseUrl;
        let _url = `${apiBaseUrl}${endpoint}`;
        
        // replace interpolated params
        if(options.params)
            for (var param in options.params)
                if (object.hasOwnProperty(param))
                    _url = _url.replace(new RegExp(':' + param, 'g'), options.params[param]);

        // add query string
        if(options.query) {
            _url += '?';
            for (var q in options.query)
                if (object.hasOwnProperty(q))
                    _url += q + '=' + options.query[q];
        }

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': (getState().auth && getState().auth.token) ? "Bearer " + getState().auth.token : ''
        }

        let rsaa = {
            [RSAA]: {
                headers,
                endpoint: _url,
                method,
                body: options.body ? JSON.stringify(options.body) : '',
                types: [ types.request, types.success, types.failure ]
            }
        }
        let resp = await dispatch(rsaa);

        // call callbacks if present
        if(!resp.error && options.onSuccess)
            options.onSuccess(resp);
        if(resp.error && options.onError) {
            options.onSuccess(resp);
        }

        if(resp.payload && resp.payload.status === 401) {
            dispatch({type: "INVALID_TOKEN"});
        }
        return resp;
    }

    actionCreator.types = types;
    return actionCreator;
}


