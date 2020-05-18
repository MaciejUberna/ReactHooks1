import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false, 
    error: null,
    data: null,
    extra: null,
    indentifier: null
};

const httpReducer = (currHttpState, action) => {
    switch(action.type) {
      case 'SEND':
        return {loading: true, error: null, data: null, extra: null, indentifier: action.indentifier};
      case 'GET':
        return {...currHttpState, loading: false, data: action.getData, extra: action.extra};
      case 'ERROR':
        return {loading: false, error: action.error};
      case 'CLEAR':
        return initialState
      default: 
        throw new Error('Should not be reached!');
    };
};

const useHttp = () => {
    const [ httpState, dispatchHttp ] = useReducer(httpReducer,initialState);

    const clear = useCallback(() => {
        dispatchHttp({type: 'CLEAR'});
    },[]);

    const sendRequest = useCallback((url, method, body, reqExtra, reqIndentifier) => {
        dispatchHttp({type: 'SEND', indentifier: reqIndentifier});
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
          }).then(response => {
            return response.json();
          }).then(responseData => {
            dispatchHttp({
                type: 'GET', 
                getData: responseData,
                extra: reqExtra
            });
          }).catch( error => {
            dispatchHttp({type: 'ERROR',error: 'Failed to featch in http.js::sendRequest function e:'+error.message});
          });
    },[]);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        indentifier: httpState.indentifier,
        clear: clear
    };
};

export default useHttp;