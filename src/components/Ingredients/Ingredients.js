import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = (props) => {
  const [ userIngredients, setUserIngredients ] = useState([]);
  const [ userIngredientsCtr, setUserIngredientsCtr ] = useState(0);

  const addIngredientHandler = ingredient => {
    setUserIngredients(prevIngredients =>
      [
        ...prevIngredients, 
        {id: userIngredientsCtr, ...ingredient}
      ]
    );
    setUserIngredientsCtr(prevState => (prevState + 1));
  }

  const removeIngredientHandler = ingId => {
    setUserIngredients(prevIngredients => [
      ...prevIngredients.filter( (ingredient) => {
        return ingredient.id !== ingId;
      })
    ]);
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
