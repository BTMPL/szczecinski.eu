---
title: Niemutowalne aktualizowanie stanu
---

## Aktualizowanie obiektów

Wielokrotnie wspominaliśmy, że jedną z zasad Reduxa jest niemutowanie stanu, a zwracanie jego kopii zawierającej nowe informacje:

```js
// źle
state.value = state.value + 1;
return state;

// dobrze
return Object.assign({}, state, { value: state.value + 1 });
```

Zapis tego typu szybko może stać się kłopotliwy w przypadku kiedy pracujemy z bardziej zagnieżdżonym stanem:

```js
const state = {
  configuration: {
    page: {
      title: 'Test'
    }
  }
}

// w celu zmiany state.configuration.page.title musimy użyć:
return Object.assign({}, state, 
  Object.assign({}, state.configuration, 
    Object.assign({}, state.configuration.page, { title: 'Nowy tytuł' })));
```

Jeżeli pracujemy w odpowiednio nowym środowisku, możemy użyć notacji [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```js
return {
  ...state,
  configuration: {
    ...state.configuration,
    page: {
      ...state.configuration.page,
      title: 'Nowy tytuł'
    }
  }
};
```

Zapis ten jest nieco czytelniejszy, choć wciąż daleki od ideału.

## Aktualizowanie tablic

Podobnie sprawa wygląda w przypadku aktualizowania tablic, cały czas musimy pamiętać o unikaniu mutacji zarówno tablic, jak i znajdujących się w nich obiektów:

```js
// dodaj element do tabeli:
return state.concat(newElement);

// usuń element (o znanym id) z tabeli:
return state.filter(element => element.id !== removeElementId);

// zaktualizuj element tabeli:
return state.map(element => {
  if (element.id === updateElementId) {
    return {
      ...element,
      title: 'Nowy tutuł'
    };
  } else {
    return element
  }
});
```

## Immer

Aktualizowanie stanu w ten sposób jest wciąż dosyć kłopotliwe, szczególnie przy bardziej rozbudowanych stanach. Jednym z rozwiązań jakie możemy użyć oferuje biblioteka [immer](https://github.com/mweststrate/immer). Immer pozwala nam na mutowanie obiektów stanu, a następnie oblicza różnicę pomiędzy starym i nowym stanem i odtwarza ją w niemutujący sposób.

> Immer opiera się o mechanizm Proxy, który dostępny jest w nowych przeglądarkach - jeżeli tworzona przez Ciebie aplikacja będzie wykorzystywana w Internet Explorer lub React Native możesz zauważyć pogorszenie wydajności. W tych przypadkach Immer używa metod ES5 do odtworzenia zmian.

W celu wykorzystania Immera w naszych reducerach potrzebować będziemy jego metody `produce`.

```bash
npm install immer
```

Jeżeli naszym zadaniem jest zmiana statusu todo o id = 1:

```js
const initialState = {
  todos: [
    {
      id: 1,
      title: 'Zaimplementuj Immer',
      status: 'in-progres'
    }
  ]
}

const action = {
  type: 'UPDATE',
  payload: 1
};
```

w przypadku korzystania z czystego JS użyli byśmy kodu:

```js
const todoReducer = (state = initialState, action) => {
  if (action.type === 'UPDATE') {
    return {
      ...state,
      todos: state.todos.map(todo => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            status: 'done';
          }
        } else {
          return todo;
        }
      });
    }
  }
  return state;
};
```

pracując z Immer natomiast:

```js
import { produce } from 'immer';

const todoReducer = (state = initialState, action) => {
  return produce(state, draft => {
    if (action.type === 'UPDATE') {
      draft.todos.forEach(todo => {
        if (todo.id === action.payload) {
          todo.status = 'done';
        }
      });
    }
  });
};
```

Obiekt `draft`, który Immer przekazuje do funkcji stanowiącej drugi argument dla `produce` jest tymczasową kopią całego stanu, na której możemy bez problemu wykonywać operacje mutujące. Nie musimy także nic zwracać z samej funkcji (ale nasz reducer wciąż musi zwracać wynik funkcji `produce`).