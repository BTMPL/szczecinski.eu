---
title: mapDispatchToProps
---

Drugim argumentem `connect` jest mechanizm pozwalający na mapowanie akcji na propsy komponentu - `mapDispatchToProps`. Jeżeli nie przekażemy go do komponentu otrzyma on metodę `store.dispatch` jako props `dispatch`. O ile wystarcza to do pełnego wykorzystywania mechanizmów Reduxa, o tyle nie jest to przykładem dobrej architektury aplikacji: w ten sposób nasz komponent staje się "świadomy" Reduxa i znów nie jest na tyle re-używalny na ile byśmy chcieli.

`mapDispatchToProps` wykorzystać można na dwa sposoby - pierwszym z nich jest przekazanie funkcji, która jako argument otrzyma metodę `store.dispatch` i powinna zwrócić obiekt z propsami, które chcemy przekazać do komponentu:

```js
const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => dispatch({
      type: 'CLICK'
    })
  }
};
```

Możemy zatem zaktualizować nasz komponent tak, by uczynić go bardziej uniwersalnym:

```js
const App = (props) => (
  <div>
    <button onClick={props.onClick}>Kliknięto 0 razy</button>
  </div>
);

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => dispatch({
      type: 'CLICK'
    })
  }
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
```

Dzięki temu zabiegowi nasz "nie połączony" komponent `App` gotowy jest do wykorzystania w innej części aplikacji, lub innej aplikacji, być może bez Reduxa.

## ownProps

Podobnie jak [mapStateToProps](redux/react/mapstatetoprops.md#ownprops), również `mapDispatchToProps` otrzymuje drugi argument, stanowiący obiekt propsów przekazanych do naszego komponentu przez rodzica.

## Ręczne przekazywanie `dispatch`

Jeżeli przekażemy jakikolwiek parametr jako drugi argument `connect`, komponent nie otrzyma już automatycznie przekazywanego `dispatch`. Jeżeli z jakiś powodów potrzebujemy przekazać `dispatch` oraz akcje do komponentu, musimy zrobić to ręcznie:

```js
const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => dispatch({
      type: 'CLICK'
    }),
    dispatch
  }
};
```

## Zapis obiektowy

`mapDispatchToProps` obsługuje także drugą formę zapisu - w miejsce funkcji możemy przekazać mapę funkcji na propsy. W takim przypadku redux oczekuje, że każda funkcja to action creator i automatycznie "owinie" ją w `dispatch`:

```js
const mapDispatchToProps = {
  onClick: () => ({
    type: 'CLICK'
  })
}
```

Oczywiście zapis staje się jeszcze bardziej prosty jeżeli mamy już zdefiniowane action creatory:

```js
import { incrementClick } from './redux/clickReducer';

const mapDispatchToProps = {
  onClick: incrementClick
};
```

Lub jeżeli chcesz przekazać WSZYSTKIE akcje:

```js
import * as actions from './redux/clickReducer';

const ConnectedApp = connect(mapStateToProps, actions)(App);
```

> Zapis obiektowy nie posiada dostępu do `ownProps` ani `dispatch` więc nie należy go używać gdy potrzebujemy móc z nich skorzystać / przekazać je do komponentu.

## Przekazywanie tylko `mapDispatchToProps`

Czasem zdarza się, że nasz komponent potrzebuje *tylko* możliwość emitowania akcji; w tym celu możemy wciąż wykorzystać `connect` a jako pierwszy argument przekazać `undefined`:

```js
const mapDispatchToProps = {
  onClick: incrementClick
};

const ConnectedApp = connect(undefined, actions)(App);
```