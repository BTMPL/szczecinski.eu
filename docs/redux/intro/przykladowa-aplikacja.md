---
title: Przykładowa aplikacja
---

Każda aplikacja oparta o Redux potrzebuje do pracy 3 rzeczy: store, reducera i akcji. Dodatkowo musimy mieć możliwość reagowania na zmiany store.

```js
import { createStore } from 'redux';

const initialState = 0;

/**
 * Reducer odpowiada za przetworzenie poprzedniego stanu aplikacji w nowy, w oparciu o akcję
 */
const reducer = (state = initialState, action) => {
  if (action.type === 'TICK') return state + 1;
  return state;
}

const store = createStore(reducer);

/**
 * Przekazując do metody subscribe funkcję rozpoczynamy "nasłuchiwanie" na zmiany stanu.
 */
const unsubscribe = store.subscribe(() => {
  console.log('Aktualna wartość licznika: ' + store.getState())
});

/**
 * Używając metody dispatch "emitujemy" akcję.
 */
store.dispatch({type: 'TICK'}); // "1"
store.dispatch({type: 'TOCK'}); // "1"

store.dispatch({type: 'TICK'}); // "2"
store.dispatch({type: 'TOCK'}); // "2"

unsubscribe();

store.dispatch({type: 'TICK'});
/**
 * Ostatnia akcja została przetworzona (i stan aplikacji to teraz "3"), 
 * ale nie ma żadnego aktywnego listenera, który zareagował by na te zmianę.
 */
```