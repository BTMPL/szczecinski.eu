---
title: Middleware
---

Redux umożliwia na rozszerzenie domyślnej obsługi tego, w jaki sposób przetwarzane są akcje poprzez mechanizm middleware. Pozwala on na "wpięcie się" w process zarówno przed przekazaniem akcji do reducera, jak i po tym jak zostanie ona przetworzona przez wszystkie reducery.

W celu dodania middleware do naszego store, musimy zarejestrować je w wywołaniu `createStore`:

```js
import { createStore, applyMiddleware } from 'redux';

const store = createStore(rootReducer, applyMiddleware(
  ourMiddleware, otherMiddleware, thirdMiddleware
));
```

## Interfejs

Samo middleware to tzw. "curried function" o następującym interfejsie:

```js
const exampleMiddleware = (store) => {
  // poziom 1
  return (next) => {
    // poziom 2
    return (action) => {
      // poziom 3
      return next(action);
    }
  }
}
```

Kolejne "poziomy" funkcji wywołane zostaną w różnych momentach życia aplikacji:

- poziom 1 i poziom 2 w czasie tworzenia store
- poziom 3 przy każdej dispatchowanej akcji

Nasze middleware powinno wywołać `next(action)` w celu przekazania akcji do reducerów, nie wykonanie tego wywołania spowoduje "przerwanie łańcucha" i akcja nie trafi do reducera - zostanie zignorowana.

Podział taki umożliwia nam wywołanie niektórych czynności tylko raz (np. połączenie się ze zdalnym serwerem do przechowywania logów o akcjach etc.).

## Przykładowe middleware

Uzbrojeni w te wiedzę możemy stworzyć proste middleware logujące każdą akcję i sprawdzającą, czy zaszła zmiana w stanie reducera:

```js
const actionInspectorMiddleware = (store) => {
  return (next) => {
    return (action) => {
      console.log('Akcja', action);
      const oldState = store.getState();

      next(action);
      
      const state = store.getState();
      if (oldState !== state) {
        console.log('Nastąpiła zmiana stanu')
      }
    }
  }
}
```

<iframe src="https://codesandbox.io/embed/5w5pmn03j4" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Przy każdej wywołanej akcji zobaczymy w konsoli jej szczegóły, a kiedy spowoduje ona zmianę stanu Redux, zostaniemy o tym poinformowani (oczywiście użyte tutaj porównanie okaże się nie skuteczne, jeżeli stan jest złożonym typem danych, np. efektem `combineReducers`).