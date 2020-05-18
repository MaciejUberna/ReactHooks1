import { useReducer } from 'react';

const httpReducer = (currHttpState, action) => {
    switch(action.type) {
      case 'SEND':
        return {loading: true, error: null, data: null};
      case 'GET':
        return {...currHttpState, loading: false, data: action.getData};
      case 'ERROR':
        return {loading: false, error: action.error};
      case 'CLEAR':
        return {...currHttpState, error: null}
      default: 
        throw new Error('Should not be reached!');
    };
};

const useHttp = () => {
    const [ httpState, dispatchHttp ] = useReducer(httpReducer,{
            loading: false, 
            error: null,
            data: null
        }
    );

    const sendRequest = (url, method, body) => {
        dispatchHttp({type: 'SEND'});
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
          }).then(response => {
            return response.json();
          }).then(responseData => {
            dispatchHttp({type: 'GET', getData: responseData});
          }).catch( error => {
            dispatchHttp({type: 'ERROR',error: 'Failed to featch in http.js::sendRequest function'});
          });
    };
    
    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error
    };
};

export default useHttp;