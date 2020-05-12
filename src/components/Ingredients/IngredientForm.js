import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  //it's better to use strings because throm input we always get strings
  //useState returns always an array with exackly 2 elements:
  //1. current state snapshot, for this rerender cycle of this component
  //2. function that allows you to update your current state
  const [ing, setIng] = useState({tile: '', amount: ''});

  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            {/* This first imput updates the state in the most correct way ensuring that all elements of state will be updated to the latest one.*/}
            <input type="text" id="title" value={ing.title} onChange={event => {
              const newTitle = event.target.value;
              setIng(prevState => ({
                ...prevState,
                title: newTitle
                })
              )
              }
            }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={ing.amount} onChange={event => setIng({
              ...ing,
              amount: event.target.value,
            })}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
