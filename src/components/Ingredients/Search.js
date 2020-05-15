import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    //Here we compare value filter from past 1/2s and current filter value
    setTimeout(() => {
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
        });
      }
    },500);
  },[filter, onLoadIngredients, inputRef])

  return (
    <section className="search">
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
