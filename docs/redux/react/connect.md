---
title: connect
---

`connect` to tzw. High Order Component. Stanowi on drugą część mechanizmu Context - jest to consumer, który komunikuje się z "najbliższym" providerem, który znajdzie podczas przechodzenia "w górę" drzewa JSX. Odbiera on dane (obiekt store) z contextu React i udostępnia komponentowi który wzbogaca.

```js
import { connect } from 'react-redux';

const App = (props) => (
  <div>
    <button onClick={() => {}}>Kliknięto 0 razy</button>
  </div>
);

const ConnectedApp = connect()(App);
```

Jeżeli w naszej aplikacji wykorzystamy teraz `<ConnectedComponent />` zobaczymy, że wyrenderuje się on poprawnie. Jeżeli podejrzymy jakie props otrzymał (np. używając React Developer Tools lub chociażby dodając `console.log(props)` do komponentu) zobaczymy nowy prop - `dispatch`. 

W ten sposób nasz komponent został "spięty" z Reduxem i może teraz emitować zdarzenia:

```js
const App = (props) => (
  <div>
    <button onClick={() => {
      props.dispatch({ type: 'CLICK' });
    }}>Kliknięto 0 razy</button>
  </div>
);
```

<iframe src="https://codesandbox.io/embed/lpzj57kjyz" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Jak widać, Redux nie przekazuje nam domyślnie danych jakie przechowuje w stanie. Jest to zabieg celowy mający na celu zapobieganie zarówno zbędnemu re-renderowaniu się komponentu jak i "zaśmiecanie" go zbędnymi informacjami.

`connect()` przyjmuje 4 parametry, pierwsze dwa omówimy w kolejnych rozdziałach.