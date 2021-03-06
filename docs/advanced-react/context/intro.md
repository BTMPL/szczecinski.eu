---
title: Wprowadzenie
---

Jednym z popularnych "problemów" występujących w React od samego początku jest przekazywanie danych między elementami nie będącymi w bezpośredniej relacji Rodzic > Dziecko.

W sytuacjach takich często stosowany jest następujący kod:

```jsx
const App = props => {
  return <Parent {...props} />;
};

const Parent = props => {
  return <Child {...props} />;
};

const Child = props => {
  return <GrandChild grandchildName={props.grandchildName} />;
};

const GrandChild = props => {
  return <div>Imię wnuczka to: {props.grandchildName}</div>;
};

ReactDOM.render(<App grandchildName={"John"} />, root);
```

Jak widać `App` "zna" dane, które chce przekazać do `Grandchild`, a wszystkie komponenty po drodze - w ten czy inny sposób - muszą być świadome tego, że jakieś dane należy przekazać. Robią to albo poprzez przekazanie wszystkich propsów jakie otrzymały (`{...props`}) albo poprzez przekazanie tylko konkretnych danych.

Sytuację taką nazywamy "prop drilling" i jest ona niepożądana z kilku powodów:

- "zaśmieca" nam API komponentu dodając do niego nie istotne (z pkt. widzenia tego komponentu) dane,
- powoduje pogorszenie wydajności poprzez re-renderowanie komponentów nawet, jeżeli dane, które się zmieniły są dla niego nieistotne
- jeżeli dane przekazujemy jak w `GrandChild` zmiana ich kształtu (np. zmiana "grandchildName" na po prostu "name") wymaga zmiany tego komponentu.

## Pojęcie kontekstu

W celu rozwiązania tego problemu React udostępnia oddzielne API znane jako "kontekst" (ang. "Context") - pozwala ono na zdefiniowanie mechanizmu przekazywania i konsumowania danych pomiędzy niezależnymi elementami i jest podstawowym budulcem wielu znanych bibliotek tj. Redux, React-Router czy Formik.

API kontekstu istniało w React od bardzo dawna, ale aż do wersji 16.3 było one celowo "pomijane" w wielu miejscach dokumentacji. Autorzy React nie byli zadowoleni ze sposobu, w jaki jest ono zrealizowane i ostrzegali, że ulegnie ono zmianie.

Nowe API, wprowadzone wraz z wersją 16.3 jest już dużo stabilniejsze i oferuje dodatkową funkcjonalność tj. integracja z React Hooks.

Kontekst składa się z 2 elementów:

- Provider - którego zadaniem jest udostępnianie danych wszystkim elementom znajdującym się w jego pod-drzewie,
- Consumer - który świadomy jest zmian w Providerze i pobiera z niego dane, przekazując je do właściwego komponentu.

Consumer korzysta ze wzorca Render Props.

## React.createContext

W celu stworzenia kontekstu, używamy metody `createContext`, która zwraca nam parę Provider + Consumer:

```jsx
const MyContext = React.createContext(fallbackValue);
// uzyskujemy dostęp do MyContext.Provider, MyContext.Consumer
```

> O tym czym jest `fallbackValue` dowiesz się w części poświęconej Consumer

Ponieważ w zdecydowanej większości przypadków, Provider i Consumer będą używane przez komponenty znajdujące się w innych plikach, kontekst zwykle tworzony jest przez oddzielne moduły, np:

```jsx
// MyContext.js
const Context = React.createContext(fallbackValue);

const { Provider, Consumer } = Context;

export { Provider, Consumer };
export default Context;

// App.js

import { Provider } from "./MyContext.js";
```

## Provider

Provider jest elementem kontekstu, który umożliwia przekazywanie danych (udostępnia dane) - sam z siebie nie jest kompletnym rozwiązaniem. Dane, które chcemy udostępnić, przekazujemy jako prop `value`, a jako dzieci elementu przekazujemy pod-drzewo, w którym dane te będą dostępne:

```jsx
const App = () => {
  return (
    <Provider value={{ random: 42 }}>
      <Home />
    </Provider>
  );
};
```

Podobnie jak dane, Provider może przekazywać także funkcje:

```jsx
class App extends React.Component {
  state = { random: 42 };

  updateRandom = () =>
    this.setState(state => ({
      random: state.random + 1
    }));

  render() {
    return (
      <Provider
        value={{
          random: this.state.random,
          updateRandom: this.updateRandom
        }}
      >
        <Home />
      </Provider>
    );
  }
}
```

> Pamiętaj o poprawnym bindowaniu funkcji, które korzystają z `this`!

## Consumer

Consumer zajmuje się pobieraniem danych udostępnionych w kontekście i przekazywaniem ich do swojego pod-drzewa.

```jsx
const Child = () => {
  return (
    <Consumer>
      {contextObject => (
        <div>Losowa wartość pobrana z kontekstu: {contextObject.random}</div>
      )}
    </Consumer>
  );
};
```

Za każdym razem, kiedy zmieni się wartość `value` przekazana do providera, każdy z komponentów, zawierających odpowiadający mu consumer ulegnie odświeżeniu (zostanie przerenderowany) przez co przekaże nowe dane do swojego pod-drzewa.

Wynika z tego kilka rzeczy, o których warto pamiętać:

- re-renderowanie się konsumenta pomija wszelkie `shouldComponentUpdate` lub `React.memo` komponentu, w którym jest użyty (co pozwala wyeliminować problemy z blokowaniem aktualizacji jakie występują np. przy połączeniu react-router + react-redux)
- dane udostępniane przez komponent Consumer dostępne są tylko w JSX - nie można użyć ich w funkcjach cyklu życia (jest to możliwe z pewnymi ograniczeniami)

> Consumer przyjmuje jeden dodatkowy prop - `unstable_observedBits` - więcej na ten temat dowiesz się z rozdziału "Context > Zaawansowane opcje".

### fallbackValue

Może zdarzyć się sytuacja, w której konsument zostanie użyty bez odpowiadającego mu providera - można sobie to wyobrazić np. w testach jednostkowych czy sytuacji, w której struktura tworzona jest na tyle dynamicznie, że nie zawsze mamy nad nią kontrolę. W tej sytuacji jako wartość, którą będzie widział konsument jest wartość przekazana do funkcji `React.createContext`.

Wbrew nazwie jaką można znaleźć w dokumentacji (`defaultValue`) nie jest to wartość domyślna - nie jest ona przekazywana do Consumer-ów, osadzonych w providerze nie deklarującym propu `value`.

## contextType

Istnieje jeszcze druga metoda pozwalająca na uzyskanie dostępu w komponentach opartych o klasy i to uzyskanie go w taki sposób, że można go następnie wykorzystać w funkcjach cyklu życia - `contextType`.

Mechanizm ten wprowadzony został jako "most" łączący stary i nowy interfejs kontekstu. W starym, w celu wykorzystania kontekstu należało zadeklarować, jakich danych w globalnym obiekcie kontekstu oczekuje nasz komponent poprzez zdefiniowanie `contextTypes`, działającym podobnie jak `propTypes` i uzyskać do nich dostęp na obiekcie `this.context`

Nowe API wprowadza możliwość pobrania **jednego** kontekstu w ten sposób:

```jsx

import Context from './MyContext'; // uwaga! importujemy cały kontekst, nie tylko Consumer!
const Child extends React.Component {
  static contextType = Context;

  render() {
    return (
      <div>Losowa wartość pobrana z kontekstu: {this.context.random}</div>
    );
  }
}
```
