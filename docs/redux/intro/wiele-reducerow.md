---
title: Wiele reducerów
---

We wszystkich przykładach użytych do tej pory wykorzystywaliśmy tylko jeden reducer. Aplikacje napisane w ten sposób szybko staną się ciężkie w utrzymaniu i rozszerzeniu a także stracą na wydajności. Redux, w odróżnieniu od flux, posiada tylko jeden globalny store (domyślnie - oczywiście nic nie stoi na przeszkodzie byśmy utworzyli więcej instancji z użyciem kolejnych `createStore`) na rzecz wielu reducerów.

Rozwiązaniem jest stworzenie zagłębionej struktury reducerów, z których każdy będzie odpowiedzialny za jedną - z biznesowego punktu widzenia - funkcję aplikacji. Jeżeli do naszej aplikacji, przetrzymującej do tej pory ilość wywołań akcji `TICK` chcemy dodać także przechowywanie akcji `HELLO` możemy ręcznie utworzyć "reducer nadrzędny" ("root reducer"):

```js
const reducer = (state = 0, action) => {
  if (action.type === 'TICK') return state + 1;
  return state;
}

const helloReducer = (state = 0, action) => {
  if (action.type === 'HELLO') return state + 1;
  return state;
}

// Tworzymy obiekt opisujący strukturę naszego store oraz reducer
// obsługujący wszystkie akcje i delegujący je do każdego z pod-reducerów
const rootReducerMap = {
  counter: reducer,
  hello: helloReducer
};

const rootReducer = (state = {}, action) => {
  // Jeżeli nie jesteś obeznany z funkcją Array.prototype.reduce, wiedz tylko
  // że wywołujemy tutaj każdą z funkcji przypisanych do kluczy obiektu rootReducerMap
  // i wynik zapisujemy w obiekcie z tymi samymi kluczami

  return Object.keys(rootReducerMap).reduce((accumulator, key) => {
    accumulator[key] = rootReducerMap[key](state[key], action);
    return accumulator;
  }, {});
}

const store = createStore(rootReducer);

store.subscribe(() => {
  console.log('Dane w Reduxie: ' , store.getState())
});

store.dispatch({ type: 'TICK' }); // "{counter: 1, hello: 0}"
store.dispatch({ type: 'TOCK' }); // "{counter: 1, hello: 0}"

store.dispatch({ type: 'TICK' }); // "{counter: 2, hello: 0}"
store.dispatch({ type: 'TOCK' }); // "{counter: 2, hello: 0}"

store.dispatch({ type: 'HELLO' }); // "{counter: 2, hello: 1}"
```
[Uruchom w codesandbox](https://codesandbox.io/s/6vzk6z2xpr)

Jak widać, dane które zwracane są przez `getState` odzwierciedlają strukturę, którą zdefiniowaliśmy dla naszego `rootReducer`. Oba reducery zostały wywołane dla każdej z akcji, ale każdy otrzymał tylko swój "kawałek" ogólnego store (jeżeli nie jesteś tego pewnym, umieść `console.log(state)` w każdym z reducerów).

## combineReducers

Oczywiście pisanie takiej funkcjonalności za każdym razem, kiedy chcemy utworzyć strukturę zagłębionych reducerów było by mało wydajne, dlatego Redux dostarcza nam nazwany eksport - `combineReducers`, który robi to za nas:

```js
import { combineReducers, createStore } from 'redux';

const reducer = (state = 0, action) => {
  if (action.type === 'TICK') return state + 1;
  return state;
}

const helloReducer = (state = 0, action) => {
  if (action.type === 'HELLO') return state + 1;
  return state;
}

const rootReducer = combineReducers({
  counter: reducer,
  hello: helloReducer  
});

const store = createStore(rootReducer);
```
[Uruchom w codesandbox](https://codesandbox.io/s/my7jk5j4m8)

Również w ten sposób należy pamiętać o tym, że docelowe dane reducera nie są już dostępne bezpośrednio po wywołaniu `store.getState()` ale są "zagnieżdżone" w kluczu odpowiadającym kluczowi z wywołania `combineReducers` (NIE nazwie reducera!).

```js
console.log(store.getState()); // "{counter: 0, hello: 0}"
console.log(store.getState().counter); // "0";
```