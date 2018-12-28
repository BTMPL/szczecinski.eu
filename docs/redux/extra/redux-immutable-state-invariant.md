---
title: redux-immutable-state-invariant
---

[immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant) to kolejne małe middleware które pozwala nam sprawdzić, czy nasze reducery przypadkiem nie mutują stanu na żadnym etapie jego aktualizacji. Przydatne jest głównie w przypadku początkujących developerów:

```bash
npm install react-invariant-state-middleware -D
```

```js
import invariant from 'redux-immutable-state-invariant';

const store = createStore(rootReducer, applyMiddleware(invariant()));
```

Teraz za każdym razem kiedy przypadkowo zmutujemy stan w reducerze, np:

```js
const initialState = {
  value: 0
};

const reducer = (state = initialState, action) => {
  if (action.type === 'INCREMENT') {
    state.value = state.value + 1;
  }

  return state;
}
```

otrzymamy w konsoli komunikat błędu:

```
Error: A state mutation was detected inside a dispatch, in the path: `value`. 
Take a look at the reducer(s) handling the action {"type":"INCREMENT"}.
```

> Pamiętaj o wyłączeniu middleware `redux-immutable-state-invariant` w buildach produkcyjnych!