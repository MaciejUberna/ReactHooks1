import React, { useReducer, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

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

const httpReducer = (currHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'GET':
      return {...currHttpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.error};
    case 'CLEAR':
      return {...currHttpState, error: null}
    default: 
      throw new Error('Should not be reached!');
  };
};

const Ingredients = (props) => {
  const [ httpState, dispatchHttp ] = useReducer(httpReducer,{loading: false, error: null});
  const [ userIngredients, dispatch ] = useReducer(ingredientReducer,[]);
  //const [ userIngredients, setUserIngredients ] = useState([]);
  //const [ isLoading, setIsLoading ] = useState(false);
  //const [ error, setError ] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  },[userIngredients]);

  //With useCallback in this configuration the function will never re-run.
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = ingredient => {
    //setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch('https://maciej-hooks-update.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then( response => {
      //setIsLoading(false);
      dispatchHttp({type: 'GET'});
      return response.json();
    }).then(responseData => {
      /*setUserIngredients(prevIngredients =>
        [
          ...prevIngredients, 
          {id: responseData.name, ...ingredient}
        ]
      );*/
      dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
    }).catch(error => {
      //setError(error.message);
      //setIsLoading(false);
      dispatchHttp({type: 'ERROR',error: 'Failed to featch in Ingredients.js::addIngredientHandler'});
    });
  }

  const removeIngredientHandler = ingId => {
    //setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch(`https://maciej-hooks-update.firebaseio.com/ingredients/${ingId}.json`, {
      method: 'DELETE',
    }).then(response => {
      /*setUserIngredients(prevIngredients => prevIngredients.filter( (ingredient) => {
        return ingredient.id !== ingId;
      })
      );*/
      dispatch({type: 'DELETE',id: ingId});
      //setIsLoading(false);
      dispatchHttp({type: 'GET'});
    }).catch( error => {
      // This one and the same render cycle, commands below are not rendered separetelly
      //setError(error.message);
      //setIsLoading(false);
      dispatchHttp({type: 'ERROR',error: 'Failed to featch in Ingredients.js::removeIngredientHandler'});
    });
  }

  const clearError = () => {
    //setError(null);
    dispatchHttp({type: 'CLEAR'});
  }

  return (
    <div className="App">

      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal> }

      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
