---
title: Testowanie reduxa
---

Ponieważ większość elementów składowych Reduxa to zwykłe, czyste funkcje testowanie ich jest bardzo proste. Poniższe przykłady używają składni [jest](https://jestjs.io/) ale inne test runnery / biblioteki asercji powinny działać równie dobrze.

## Testowanie kreatorów akcji

W większości wypadków kreatory akcji będą funkcjami, które wywołane z parametrem zwrócą akcję, więc możemy testować je za pomocą zwykłych asercji:

```js
const updateCounter = (byValue = 0) => {
  return {
    type: UPDATE_COUNTER,
    payload: byValue
  }
};

expect(updateCounter(5)).toEqual({
  type: UPDATE_COUNTER,
  payload: 5
});

expect(updateCounter()).toEqual({
  type: UPDATE_COUNTER,
  payload: 0
});
```

### Testowanie asynchronicznych akcji

Jeżeli musimy przetestować asynchroniczne kreatory akcji możemy oczywiście użyć `createStore` w celu utworzenia store dla naszych testów (albo zaimportować dokładnie ten sam, którego używa nasza aplikacji). Możemy także skorzystać z biblioteki [redux-mock-store](https://github.com/dmitry-zaets/redux-mock-store).

```bash
npm install redux-mock-store
```

W naszych testach zastępujemy `createStore` z `redux` metodą `configureStore` z `redux-mock-store`:

```js
// testowany kreator
const fetchTodosFromApi = () => {
  return (dispatch) => {
    dispatch({
      type: DATA_LOADING
    });

    // Do poprawnego działania - użycia notacji `dispatch(fetchTodosFromApi()).then(...`
    // konieczne jest zwrócenie promisa z wewnątrz thunka
    return actuallyGetDataFromApi().then((data) => {
      dispatch({
        type: DATA_LOADED,
        payload: data
      })
    })
  }
}

// test
import { configureStore } from 'redux-mock-store';
import thunk from 'redux-thunk';

const initialState = {
  todos: []
};
const store = configureStore([thunk])(initialState);

store.dispatch(fetchTodosFromApi()).then(() => {
  expect(store.getState().todos).toEqual([
    {
      title: 'Informacje pobrane z serwera',
      status: 'in-progress';
    }
  ]);
  expect(store.getActions()[0].type).toEqual(DATA_LOADING);
  expect(store.getActions()[1].type).toEqual(DATA_LOADED);
});
```

> Oczywiście powinniśmy stworzyć mock wewnętrznych mechanizmów funkcji `fetchTodosFromApi` (np. zastępując `fetch`, `axios` czy inne metody), tak, by nie odwoływać się do serwera.

## Testowanie reducerów

Podobnie w przypadku reducerów - są to czyste funkcje, które wywołane z odpowiednim stanem i akcją zwracają oczekiwaną wartość:

```js
const initialState = {
  todos: []
};

const addTodo = (title) => {
  return {
    type: ADD_TODO,
    payload: {
      title: title,
      status: 'in-progress'
    }
  };
};

const reducer = (state = initialState, action) => {
  if (action.type === ADD_TODO) {
    return {
      ...state,
      todos: state.todos.concat(action.payload)
    }
  }
};

expect(reducer(undefined, addTodo('test'))).toEqual({
  todos: [
    {
      title: 'test',
      status: 'in-progress'
    }
  ]
});
```

## Testowanie komponentów

Sprawy nieco bardziej komplikują się w przypadku testowania komponentów korzystających z Reduxa. Do tej pory tworzyliśmy nasze komponenty tak, by dany moduł exportował "połączony" komponent:

```js
class MyApp extends React.Component {

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    ...
  }

}

export default connect(mapStateToProps)(MyApp);
```

Jeżeli chcieli byśmy przetestować taki komponent, otrzymamy błąd informujący o tym, że nie udało się znaleźć store Reduxa w kontekście. Musieli byśmy w naszych testach używać `<Provider>` etc. żeby odtworzyć środowisko, w jakim działa komponent. Zamiast tego dobrym zwyczajem jest eksportowanie zarówno komponentu jak i kontenera (połączonego komponentu) z modułu:

```js
export class MyApp extends React.Component {

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    ...
  }

}

export default connect(mapStateToProps)(MyApp);
```

A następnie importowanie nie połączonej wersji w testach i testowanie, czy w odpowiednich cyklach życia wywołuje on odpowiednie metody:

```js
import { MyApp } from './my/module';

const spy = jest.fn();
mount(<MyApp fetchData={spy} />);

expect(spy).toHaveBeenCalled();
```

### Testowanie połączonych komponentów

Podobnie jak w przypadku testowania asynchronicznych kreatorów akcji, tak i w przypadku testowania połączonych komponentów możemy w naszych testach stworzyć własny store i owinąć testowane komponenty w `Provider`:

```js
import store from './my/redux/store';

store.dispatch({
  type: ADD_TODO,
  payload: {
    title: 'Napisać test połączonego komponentu',
    status: 'in-progress'
  }
});

const wrapper = mount(
  <Provider store={store}>
    <ConnectedComponent />
  </Provider>
);

expect(wrapper.find(ConnectedComponent).text()).tMatch('Napisać test połączonego komponentu');
```