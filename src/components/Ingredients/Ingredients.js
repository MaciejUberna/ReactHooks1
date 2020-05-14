import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = (props) => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  //Use effect buy default gets executed after evry component render cycle and when for every render cycle.
  // without [] as the last argument useEffect racts like componentDidUpdate it runs function after evry component update
  // with [] it behaves like componentDidMount, it runs onlu once after the render
  useEffect(() => {
    fetch('https://maciej-hooks-update.firebaseio.com/ingredients.json')
    .then(response => response.json())
    .then(responseData => {
      const loadedIngredients= [];
      for(const key in responseData) {
        loadedIngredients.push({
          id: key,
          ...responseData[key]
        });
      };
      setUserIngredients(loadedIngredients);
    });
  }, []);

  const addIngredientHandler = ingredient => {
    fetch('https://maciej-hooks-update.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then( response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients =>
        [
          ...prevIngredients, 
          {id: responseData.name, ...ingredient}
        ]
      );
    });
  }

  const removeIngredientHandler = ingId => {
    setUserIngredients(prevIngredients => prevIngredients.filter( (ingredient) => {
        return ingredient.id !== ingId;
      })
    );
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
