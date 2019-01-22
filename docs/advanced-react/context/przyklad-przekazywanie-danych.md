---
title: Przykład zastosowania: system translacji
---

Dobrym przykładem mechanizmu, który wykorzystuje kontekst jest np. mechanizm tłumaczenia komunikatów: aplikacja powinna udostępniać dane wszystkim komponentom, i pozwalać na zmianę języka "w locie".

Kontekst powinien być dostępny zarówno dla głównego komponentu aplikacji jak i w dowolnym innym module więc zaczniemy od zdefiniowania dla niego oddzielnego modułu, co pozwoli nam na importowanie go w dowolnym miejscu. Moduł eksportuje zarówno cały kontekst jak i oddzielnie `Provider` i `Consumer` jako nazwane eksporty:

```js
import React from "react";
const TranslationContext = React.createContext();

const { Provider, Consumer } = TranslationContext;

export { Provider, Consumer };
```

Dane dotyczące tłumaczeń możemy zdefiniować w oddzielnym pliku lub w pliku wejściowym. Tworzymy także komponent główny przechowujący informacje nt. aktualnie ustawionego języka:

```jsx
const translation = {
  pl: {
    hello: "Witaj w mojej aplikacji!"
  },

  en: {
    hello: "Welcome to my app!"
  }
};

class App extends React.Component {
  state = {
    language: "pl"
  };

  handleLanguageChange = language => this.setState({ language });

  render() {
    return <Home />;
  }
}
```

Przygotowany w ten sposób komponent jest gotowy do integracji naszego modułu. Dodajemy zatem Providera do funkcji render:

```jsx
  render() {
    return (
      <Provider
        value={{
          setLanguage: this.handleLanguageChange,
          language: this.state.language,
          labels: translation[this.state.language]
        }}
      >
        <Home />
      </Provider>
    );
  }
```

Udostępnione dane zawierają:

- `setLanguage` - funkcja pozwalająca na zmianę aktualnie ustawionego języka,
- `language` - aktualnie ustawiony język
- `labels` - dane tłumaczenia dla aktualnie ustawionego języka

W tym momencie możemy już przystąpić do tworzenia komponentu, który będzie pobierał udostępnione dane:

```jsx
import { Consumer } from "./TranslationContext";

const T = props => <Consumer>{({ labels }) => labels[props.label]}</Consumer>;
export default T;
```

Komponent ten jest bardzo prosty (czytaj: nie posiada zaawansowanych funkcjonalności): jedyne co robi, to pobiera z kontekst obiekt `labels` i wyświetla wartość, dla klucza, który został mu przekazany, np:

```jsx
<T label={"hello"} />
```

Spowoduje wyświetlenie wartości odpowiadającej kluczowi "hello", z obiektu przekazanego przez kontekst.

W tym momencie możemy już używać komponentu `T` w komponencie `Home` w celu dodania dynamicznego tłumaczenia. Wszędzie tam, gdzie chcieli byśmy umożliwić zmianę języka, możemy skorzystać z udostępnionej metody:

```jsx
<Consumer>
  {({ setLanguage }) => (
    <button onClick={() => setLanguage("en")}>English</button>
  )}
</Consumer>
```

### Kompletny przykład

<iframe src="https://codesandbox.io/embed/ryz80j1564" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
