import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();
  const [ error, setError ] = useState();

  useEffect(() => {
    //Here we compare value filter from past 1/2s and current filter value
    const timer = setTimeout(() => {
      if(filter === inputRef.current.value) {
        const query = filter.length === 0 
          ? '' 
          : `?orderBy="title"&equalTo="${filter}"`;
        fetch('https://maciej-hooks-update.firebaseio.com/ingredients.json'+query)
        .then(response => response.json())
        .then(responseData => {
          const loadedIngredients= [];
          for(const key in responseData) {
            loadedIngredients.push({
              id: key,
              ...responseData[key]
            });
          };
          onLoadIngredients(loadedIngredients)
        }).catch(error => {
          setError(error.message)
        });
      }
    },500);
    //The cleanup will run for previous effect before new effect is applied.
    //So this cleans up the old timer before it sets a new one and this ensures the we always only have one.
    return () => {
      clearTimeout(timer);
    };
  },[filter, onLoadIngredients, inputRef])

  const clearError = () => {
    setError(null);
  }

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal> }
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text" 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
