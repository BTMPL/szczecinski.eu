---
title: useReducer
---

Reducer to mechanizm, który powinien znać każdy, kto pracował z Reduxem.

Krótkie przypomnienie: reducer to funkcja, która w oparciu o stan i obiekt, opisujący jego zmianę, zwraca nowy stan, z zastosowaną zmianą. Dodatkowo, zmiana ta musi zajść w sposób, który nie mutuje oryginalnego stanu. Jeżeli reducer nie wie, jak obsłużyć daną akcję, powinien zwrócić poprzedni stan.

> #### Uwaga
>
> W odróżnieniu od Reduxa, akcja nie musi zawierać pola `type`.

`useState` zalecany jest do pracy z "płaskimi" danymi - łańcuchy znaków, liczby czy wartości logiczne. Jeżeli chcemy pracować ze złożoną strukturą (lub uzyskać mechanizm zbliżony do `this.setState`!) zaleca się użyć reducerów.

`useReducer` musi być wywołany z 2 argumentami: reducerem oraz wartością początkową. Podobnie jak `useStatez zwara on tablicę z danymi i mechanizmem pozwalającym na ich zmianę. Zaimplementujmy prosty komponent licznika, pozwalający na zmianę wartości.

```jsx
const [state, dispatch] = useReducer(
  (state, action) => {
    if (action.type === "INCREMENT")
      return {
        value: state.value + action.value
      };

    if (action.type === "DECREMENT")
      return {
        value: state.value - action.value
      };

    return state;
  },
  { value: 0 }
);
```

Domyślnie, w `state` otrzymamy obiekt o wartości `{ value: 0 }`. Możemy modyfikować jego wartość, używając metody `dispatch` i przekazując do niej obiekt, opisujący zmianę, np:

```js
dispatch({
  type: "INCREMENT",
  value: 1
});
```

`useReducer` pozwala także na przekazanie trzeciego argumentu - akcji, która wywołana zostanie na reducerze przy pierwszym renderowaniu komponentu. Pozwala to na dzielenie reducera między komponentami lub powiązanie początkowej wartości i props komponentu:

```jsx
const initialReducerValue = { value: 0 };
const Counter = ({ initial = 0 }) => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      if (action.type === "INCREMENT")
        return {
          value: state.value + action.value
        };

      if (action.type === "DECREMENT")
        return {
          value: state.value - action.value
        };

      return state;
    },
    initialReducerValue,
    initial !== 0 ? { type: "INCREMENT", value: initial } : undefined
  );

  return (
    <div>
      <button onClick={() => dispatch({ type: "DECREMENT", value: 1 })}>
        -1
      </button>
      {state.value}
      <button onClick={() => dispatch({ type: "INCREMENT", value: 1 })}>
        +1
      </button>
    </div>
  );
};
```

## Kompletny przykład

<iframe src="https://codesandbox.io/embed/zrn7povy0p" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
