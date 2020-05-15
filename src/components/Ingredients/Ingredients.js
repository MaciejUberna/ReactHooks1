import React, { useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = (props) => {
  const [ userIngredients, setUserIngredients ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  },[userIngredients]);

  //With useCallback in this configuration the function will never re-run.
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://maciej-hooks-update.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then( response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients =>
        [
          ...prevIngredients, 
          {id: responseData.name, ...ingredient}
        ]
      );
    }).catch(error => {
      setError(error.message);
    });
  }

  const removeIngredientHandler = ingId => {
    setIsLoading(true);
    fetch(`https://maciej-hooks-update.firebaseio.com/ingredients/${ingId}.json`, {
      method: 'DELETE',
    }).then(response => {
      setUserIngredients(prevIngredients => prevIngredients.filter( (ingredient) => {
        return ingredient.id !== ingId;
      })
      );
      setIsLoading(false);
    }).catch( error => {
      setError(error.message);
    });
  }

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">

      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal> }

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
