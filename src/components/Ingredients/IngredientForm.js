import React, { useState } from 'react';

import LoadingIndicator from '../UI/LoadingIndicator';
import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {


  //it's better to use strings because throm input we always get strings
  //useState returns always an array with exackly 2 elements:
  //1. current state snapshot, for this rerender cycle of this component
  //2. function that allows you to update your current state

  //2 rooles of using hooks:
  //1. You MUST use hook inside functions or other custom hooks.
  //2. Use hooks in root level of your component and cannot use hook in for example if statement
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  console.log('RENDERING INGREDIENT FORM');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle} onChange={event => (
              setEnteredTitle(event.target.value)
            )
            }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount} onChange={event => (
              setEnteredAmount(event.target.value)
            )
            }/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {/* && means this is only render when it is true */}
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
