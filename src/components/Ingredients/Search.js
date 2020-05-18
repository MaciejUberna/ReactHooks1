import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

import useHttp from '../../hooks/http';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();
  //const [ error, setError ] = useState();
  const {isLoading, data, error, sendRequest, clear} = useHttp();

  useEffect(() => {
    //Here we compare value filter from past 1/2s and current filter value
    const timer = setTimeout(() => {
      if(filter === inputRef.current.value) {
        const query = filter.length === 0 
          ? '' 
          : `?orderBy="title"&equalTo="${filter}"`;
        sendRequest('https://maciej-hooks-update.firebaseio.com/ingredients.json'+query,'GET');
      }
    },500);
    //The cleanup will run for previous effect before new effect is applied.
    //So this cleans up the old timer before it sets a new one and this ensures the we always only have one.
    return () => {
      clearTimeout(timer);
    };
  },[filter, sendRequest, inputRef])

  useEffect(() => {
    if(!isLoading && !error && data) {
      const loadedIngredients= [];
      for(const key in data) {
        loadedIngredients.push({
          id: key,
          ...data[key]
        });
      };
      onLoadIngredients(loadedIngredients)
    }
  },[data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal> }
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
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
