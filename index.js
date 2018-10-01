import { RSAA } from 'redux-api-middleware';

let baseUrl = "";

// Generic description for an API call
export const createApiAction = (method, endpoint) => {
    let actionName = `[${method}]${endpoint}`;
    let types = {
        request: actionName + '_REQUEST', 
        success: actionName + '_SUCCESS', 
        failure: actionName + '_FAILURE'
    }

    let actionCreator = (options) => async (dispatch, getState) => {
        let apiBaseUrl = getState().api.baseUrl;
        let endpoint = `${apiBaseUrl}${endpoint}`;
        
        // replace interpolated params
        if(options.params)
            for (var param in options.params)
                if (object.hasOwnProperty(param))
                    endpoint = endpoint.replace(new RegExp(':' + param, 'g'), options.params[param]);

        // add query string
        if(options.query) {
            endpoint += '?';
            for (var q in options.query)
                if (object.hasOwnProperty(q))
                    endpoint += q + '=' + options.query[q];
        }

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getState().auth.token ? "Bearer " + getState().auth.token : ''
        }

        let rsaa = {
            [RSAA]: {
                headers,
                endpoint,
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


