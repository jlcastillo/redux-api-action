/* API ACTION CALLS.

- Create them in your action.js with:

    import { api } from '../utils/api';
    export const apiGetAccuracy = api('POST', '/api/prediction/accuracy');

- Use them within your React component.js methods or your Redux actions.js functions via dispatch, i.e.:

    Option 1: dispatch to store

                let params = {years: 3, fields: ['balance.total', 'assets.total']}
                dispatch(apiGetAccuracy(params))
    
    Option 2: dispatch & ignore, modify HTTP response and re-dispatch to store. 

                let action = await dispatch(apiGetAccuracy(reqParams))
                ... we may ignore the action dispatched to Redux reducers ...
                let httpResponse = action.payload
                ... modify httpResponse ...
                action.type = "MyAction"
                dispatch(action)
                ... handle "MyAction" in reducers ...

    Option 3: dispatch with Redux connect mapDispatchToProps

                const VariableCheckbox = ({ apiGetAccuracy }) =>
                    <Checkbox onChange={(value) => apiGetAccuracy(varStr)}>
                        Title<span className="checkmark" />
                    </Checkbox>

                const mapDispatchToProps = {
                    apiGetAccuracy
                }
                export default connect(null, mapDispatchToProps)(VariableCheckbox);

- Attend the actions results in your reducer.js with:

    import { apiGetAccuracy } from '../actions/predict';

    (state = [], { type, payload }) => {
        switch(type) {
            case apiGetAccuracy.types.success: {
                return { ...state, accuracy: payload.accuracy };
            }
            default:
                return state;
        }
    }

*/

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

    let actionCreator = (params) => async (dispatch, getState) => {
        let apiBaseUrl = getState().api.baseUrl;

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getState().auth.token ? "Bearer " + getState().auth.token : ''
        }

        let rsaa = {
            [RSAA]: {
                headers,
                endpoint: `${apiBaseUrl}${endpoint}`,
                method,
                body: JSON.stringify(params),
                types: [ types.request, types.success, types.failure ]
            }
        }
        let resp = await dispatch(rsaa);
        if(resp.payload && resp.payload.status === 401) {
            dispatch({type: "INVALID_TOKEN"});
        }
        return resp;
    }

    actionCreator.types = types;
    return actionCreator;
}


