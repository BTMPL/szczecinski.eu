---
title: Provider
---

Mechanizm Context React zakłada istnienie 2 elementów w strukturze JSX: Provider-a, który udostępnia i przetwarza dane, oraz Consumer-a, który wykorzystuje dane i przekazuje nowe dane do przetworzenia.

Pakiet `react-redux` udostępnia oba te elementy jako nazwane eksporty:

```js
import { Provider } from "react-redux";
```

Komponent `Provider` jest niczym innym jak providerem Reactowego API i w celu poprawnego działania powinien "owijać" on całą gałąź JSX naszej aplikacji, w której chcemy używać Reduxa, najczęściej oznacza to, że owija on całą aplikację:

```js
import { Provider } from "react-redux";

// nasz plik, eksportujący store będący wynikiem wywołania `createStore`
import { store } from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

Jeżeli pominiemy ten krok, żaden z elementów, próbujących komunikować się z Reduxem nie będzie działać, a w konsoli zobaczymy błąd informujący o tym, że komponent nie jest w stanie znaleźć obiektu `store` w kontekście.

W starszych wersjach react-redux (wersja < 6) możliwe było dodatkowo zdefiniowanie nazwy props, pod którym udostępniany będzie store, jednak nie jest to już wspierane (ani konieczne) w nowszych wersjach.
