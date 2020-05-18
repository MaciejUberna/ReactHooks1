//useCallback was used to save the function that does not change, useMemo saves value that should not change
import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default: 
      throw new Error('Should not get there!');
  };
};

const Ingredients = (props) => {
  //const [ httpState, dispatchHttp ] = useReducer(httpReducer,{loading: false, error: null});
  
  const [ userIngredients, dispatch ] = useReducer(ingredientReducer,[]);
  const {isLoading, error, data, sendRequest, reqExtra, indentifier, clear} = useHttp();
  
  //const [ userIngredients, setUserIngredients ] = useState([]);
  //const [ isLoading, setIsLoading ] = useState(false);
  //const [ error, setError ] = useState();

  useEffect(() => {
    //console.log('isLoading:'+isLoading+'\nerror:'+error+'\nindentifier:'+indentifier+'\ndata',data,'\nreqExtra:'+reqExtra)
    if (!isLoading && !error && indentifier === 'DEL_INGREDIENT') {
      //console.log('DEL_INGREDIENT fired');
      dispatch({type: 'DELETE',id: reqExtra});
    } else if(!isLoading && !error && indentifier === 'ADD_INGREDIENT'){
      //console.log('ADD_INGREDIENT fired')
      dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra}});
    }
  },[data, reqExtra, indentifier, error, isLoading]);

  //With useCallback in this configuration the function will never re-run.
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://maciej-hooks-update.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
    //setIsLoading(true);
    // dispatchHttp({type: 'SEND'});
    // fetch('https://maciej-hooks-update.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then( response => {
    //   //setIsLoading(false);
    //   dispatchHttp({type: 'GET'});
    //   return response.json();
    // }).then(responseData => {
    //   /*setUserIngredients(prevIngredients =>
    //     [
    //       ...prevIngredients, 
    //       {id: responseData.name, ...ingredient}
    //     ]
    //   );*/
    //   dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
    // }).catch(error => {
    //   //setError(error.message);
    //   //setIsLoading(false);
    //   dispatchHttp({type: 'ERROR',error: 'Failed to featch in Ingredients.js::addIngredientHandler'});
    // });
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingId => {
    sendRequest(
      `https://maciej-hooks-update.firebaseio.com/ingredients/${ingId}.json`,
      'DELETE',
      null,
      ingId,
      'DEL_INGREDIENT'
    );
    //setIsLoading(true);
    // dispatchHttp({type: 'SEND'});
    // fetch(`https://maciej-hooks-update.firebaseio.com/ingredients/${ingId}.json`, {
    //   method: 'DELETE',
    // }).then(response => {
    //   /*setUserIngredients(prevIngredients => prevIngredients.filter( (ingredient) => {
    //     return ingredient.id !== ingId;
    //   })
    //   );*/
    //   dispatch({type: 'DELETE',id: ingId});
    //   //setIsLoading(false);
    //   dispatchHttp({type: 'GET'});
    // }).catch( error => {
    //   // This one and the same render cycle, commands below are not rendered separetelly
    //   //setError(error.message);
    //   //setIsLoading(false);
    //   dispatchHttp({type: 'ERROR',error: 'Failed to featch in Ingredients.js::removeIngredientHandler'});
    // });
  },[sendRequest]);

  // const clearError = useCallback(() => {
  //   //setError(null);
  //   //dispatchHttp({type: 'CLEAR'});
  // },[]);

  //List of dependencies in useMemo tells in which dependencies - objects influence memo to rerun it and update the variable
  //useMemo is an alternarive to React.memo(...)
  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
        ingredients={userIngredients} 
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients,removeIngredientHandler]);

  return (
    <div className="App">

      {error && (
        <ErrorModal onClose={clear}>{error}</ErrorModal> 
      )}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
