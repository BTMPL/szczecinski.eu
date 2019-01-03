---
title: redux-thunk
---

W sekcji poświęconej akcjom i kreatorom akcji poznaliśmy kilka ograniczeń:

- kreatory akcji muszą być synchroniczne,
- kreatory akcji nie mają dostępu do stanu Reduxa

Oznacza to ,ze nie możemy używać kreatorów np. do pobrania danych z API i przekazania ich do Reduxa; wszelkie tego typu operacje musiały by mieć miejsce w cyklu życia komponentu. Nieco komplikuje to działanie Reduxa:

1. Komponent rozpoczyna pobieranie danych
2. Komponent przekazuje dane do akcji
3. Akcja aktualizuje Redux
4. Komponent dostaje dane jako props

Niestety, w ten sposób znów "wiążemy" nasz komponent UI z logiką aplikacji. Aby temu zapobiec możemy użyć middleware [redux-thunk](https://github.com/reduxjs/redux-thunk). Uzbrojeni w wiedzę nt. działania middleware zacznijmy od analizy kodu źródłowego:

```js
const thunkMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  return next(action);
};
```

> Kod został nieznacznie uproszczony na potrzeby przykładu.

## Przykładowy thunk

Jak widać, middleware wykonuje tylko jedną prostą operację: jeżeli wartość przekazana do `dispatch()` jest funkcją, zostaje ona przechwycona (nie jest wywołane `next(action)`) i wywołana z 2 argumentami: `dispatch` i `getState`. Dzięki temu możemy tworzyć ["thunki"](https://en.wikipedia.org/wiki/Thunk)

```js
const getDataFromApi = () => {
  // Nasz action creator nie zwraca akcji, ale funkcję
  return function getData(dispatch) {

    // Funkcja zostaje następnie wywołana przez redux-thunk i otrzymuje
    // dostęp do dispatch i getStore. Wykonujemy zapytanie do API.
    makeApiCall().then(data => {
      // I kiedy zostanie ono zakończone, dispatchujemy właściwą akcję
      dispatch({
        type: 'DATA_LOADED',
        payload: data
      });
    }).catch(error => {
      dispatch({
        type: 'DATA_LOAD_ERROR',
        error: true,
        payload: error
      });
    });
  }
};

const mapDispatchToProps = {
  getDataFromApi
};
```

W tym momencie przebieg danych jest następujący:

1. Komponent wywołuje `props.getDataFromApi()`
2. Do Reduxa dispatchowana jest funkcja `getData`
3. Middleware `redux-thunk` sprawdza, że typem `action` jest `function`; wywołuje funkcję z argumentem `dispatch` i `getState` (który ignorujemy) i przerywa łańcuch
4. Funkcja `getData` zostaje wywołana i wykonuje zapytanie do api (Promise)
5. `makeApiCall` wykonuje się poprawnie (lub z błędem) i wywołuje `dispatch` z właściwą akcją
6. Middleware `redux-thunk` sprawdz, że typem `action` NIE jest `function` i po prostu przekazuje ją do kolejnego middleware i dalej reducera
7. Komponent ulega przerenderowaniu z nowymi danymi