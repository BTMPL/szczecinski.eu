---
title: Redux i React
---

Podstawowa wersja implementacji Redux w React jest stosunkowo prosta - każdy komponent, który chciałby wchodzić w interakcję z Reduxem powinien mieć dostęp do odpowiedniej instancji store. Może on wtedy pobierać stan (`store.getState()`) i emitować zdarzenia (`store.dispatch()`):

```js
import React from "react";
import ReactDOM from "react-dom";

import { createStore, combineReducers } from 'redux';

const reducer = (state = 0, action) => {
  if (action.type === 'CLICK') return state + 1;
  return state;
}

const store = createStore(combineReducers({
  counter: reducer
}));

class App extends React.Component {

  state = { count: 0 };

  handleClick = () => {
    store.dispatch({ type: 'CLICK' });
    this.setState({
      count: store.getState().counter
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Kliknięto {this.state.count} razy</button>
      </div>
    )
  }
}
```
[Uruchom w codesandbox](https://codesandbox.io/s/1vz28vk2n4)

Przepływ danych w powyższej aplikacji jest następujący:

1. Użytkownik wchodzi w interakcję z aplikacją (klika guzik)
2. Funkcja `handleClick` emituje akcje `{ type: 'CLICK' }`
3. Redux przepuszcza akcję przez wszystkie reducery i generuje nowy stan
4. Funkcja `handleClick` wywołuje `store.getState()` by pobrać nowy stan - aktualizacje stanu odbywają sie (domyślnie) w sposób synchroniczny
5. Funkcja `handleClick` aktualizuje swój wewnętrzny stan w oparciu o dane z reduxa i tym samym re-renderuje się
6. Komponent wyświetla nową informację

Tego typu rozwiązanie ma kilka problemów, głównym jest to, że nasz komponent jest nieświadomy zmian stanu, wynikających z akcji, które nie zostały przez niego wyemitowane. Źródło zwiększania licznika może być zupełnie niezależne od interakcji z naszym komponentem (np. nowa wiadomość przychodząca z serwera).

W celu rozpoczęcia poprawnej pracy z Reduxem, komponent musi zasubskrybować informacje o zmianach stanu - robimy to oczywiście za pomocą `store.subscribe()`:

```js
  componentDidMount() {
    this.listener = store.subscribe(() => {
      this.setState({
        count: store.getState().counter
      });
    });
  }

  componentWillUnmount() {
    // Pamiętaj o usunięciu subskrypcji w momencie, kiedy usuwamy komponent
    // by nie przetrzymywać go w pamięci i umozliwiść zwolnienie za pomocą Garbage Collectora
    this.listener();
  }

  handleClick = () => {
    store.dispatch({ type: 'CLICK' });
  }
```
[Uruchom w codesandbox](https://codesandbox.io/s/305zq4jxpm)

Przepływ danych został teraz nieco zmieniony:

1. Komponent subskrybuje informacje o zmianie store w momencie zamontowania.
2. Użytkownik wchodzi w interakcję z aplikacją (klika guzik)
3. Funkcja `handleClick` emituje akcje `{ type: 'CLICK' }`
4. Redux przepuszcza akcję przez wszystkie reducery i generuje nowy stan
5. Redux wywołuje callback, który w kroku 1 zarejestrował komponent
6. Callback aktualizuje stan komponentu w oparciu o dane z Reduxa i re-renderuje się
7. Komponent wyświetla nową informację

Technicznie powinniśmy jeszcze wywołać `store.getState()` ręcznie w konstruktorze i przypisać początkową wartość `this.state.count`, na wypadek, gdyby komponent był zamontowany w momencie, kiedy jakieś dane znajdują się już w Reduxie:

```js
  constructor(props) {
    super(props);

    this.state = {
      count: store.getState();
    }
  }
```

Pozostajemy jednak z jeszcze dwa problemy - problemy ideologicznym. 

- dane do naszego komponentu nie wpływają już jako props, a "pojawiają się" nagle, co zaprzecza jednej z podstawowych reguł React,
- każdy komponent, który potrzebuje komunikować się z Reduxem musi mieć dostęp do obiektu `store`, sposób, w jaki zaimplementowaliśmy to powyżej "spaja" naszą aplikację z Reduxem - nasze komponenty nie mogą być już łatwo używane w innych projektach i środowiskach (np. w testach)

Problemy te rozwiąże dla nas biblioteka [react-redux](https://react-redux.js.org/), czyli tak zwany "binding" czy "bridge" łączący Redux i React.