---
title: "Zaawansowane opcje"
---

## Optymalizowanie mechanizmu re-renderowania

Context API wyposażone jest w mechanizm pozwalający na bardziej dokładne kontrolowanie sytuacji, w której komponent jest informowany o zmianie i ulega re-renderowaniu. W przykładowej sytuacji, kiedy Provider udostępnia obiekt z wieloma informacjami, a Consumer interesuje się tylko wybranymi z nich będzie on re-renderowany nawet, kiedy zmianie ulegną nie wykorzystywane przezeń informacje:

```jsx
<Provider
  value={{
    value1: this.state.value1,
    value2: this.state.value2
  }}
>
  (...)
</Provider>;

// ...

const Child1 = () => {
  return <Consumer>{({ value1 }) => <div>Child1: {value1}</div>}</Consumer>;
};
```

Jeżeli komponent taki renderuje jakieś skomplikowane API (lub jest renderowany wielokrotnie) może mieć to negatywny wpływ na wydajność całej aplikacji.

Aby temu zapobiec, kontekst może wysłać informacje o tym, co dokładnie uległo zmianie. W tym celu używa mechanizmu "observed bits". Podobnie jak w przypadku Provider + Consumer mechanizm ten składa się z 2 elementów i wykorzystuje operacje na bitach ([artykuł MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)).

> #### Uwaga
>
> Oczywiście komponenty korzystające z kontekstu re-renderują się też w normalnych okolicznościach, np. jeżeli re-renderuje się ich rodzic. Kompletny przykład używa `shouldComponentUpdate` zwracające `false` w celu powstrzymania tego mechanizmu - pamiętaj, że kontekst pozwala na ignorowanie `shouldComponentUpdate` rodzica!

### changedBits

Optymalizację naszego kontekstu powinniśmy rozpocząć od zdefiniowania elementów, które będziemy mogli "obserwować". Nasz przykładowy kontekst przekazywać będzie dwie wartości numeryczne:

```js
const Context = React.createContext({
  value1: 0,
  value2: 0
});
```

Aplikacja posiadać będzie również komponenty zainteresowane jedną albo drugą, ale nie oboma wartościami:

```jsx
const Child1 = () => {
  return (
    <Context.Consumer>
      {({ value1 }) => <div>Child1: {value1}</div>}
    </Context.Consumer>
  );
};

// I analogiczny Child2
```

Aby zdefiniować elementy, które można obserwować używamy notacji binarnej; dla naszej wygody utwórzmy sobie mapę:

```js
const CONTEXT_OBSERVABLE_MAP = {
  value1: 0b01,
  value2: 0b10
};
```

Aby poinformować co uległo zmianie, używamy drugiego argumentu `createContext`, który przy każdej aktualizacji wywołany jest z poprzednią i przyszłą wartością:

```js
const Context = React.createContext(
  {
    value1: 0,
    value2: 0
  },
  (prev, next) => {
    let result = 0b00;
    if (prev.value1 !== next.value1) result |= CONTEXT_OBSERVABLE_MAP.value1;
    if (prev.value1 !== next.value2) result |= CONTEXT_OBSERVABLE_MAP.value2;

    return result;
  }
);
```

Teraz, za każdym razem kiedy kontekst ulegnie zmianie, uruchomiona zostanie funkcja (`changedBits`) i wykonana zostanie logika:

- załóż wynik `0b00`
- jeżeli zmieniło się `value1` - dodaj `0b01`
- jeżeli zmieniło sie `value2` - dodaj `0b10`
- zwróć wynik

Możliwe wyniki to:

- `0b00` - nic nie uległo zmianie
- `0b01` - zmianie uległo `value1`
- `0b10` - zmianie uległo `value2`
- `0b11` - zmianie uległo `value1` i `value2`

### observedBits

Jeżeli uruchomimy teraz naszą aplikację, nie zauważymy żadnych zmian - komponenty dalej są re-renderowane niezależnie od tego co uległo zmianie.

Aby poinformować Consumer co dokładnie ma obserwować, używamy prop `unstable_observedBits`:

```jsx
const Child1 = () => {
  return (
    <Context.Consumer unstable_observedBits={CONTEXT_OBSERVABLE_MAP.value1}>
      {({ value1 }) => <div>Child1: {value1}</div>}
    </Context.Consumer>
  );
};

const Child2 = () => {
  return (
    <Context.Consumer unstable_observedBits={CONTEXT_OBSERVABLE_MAP.value2}>
      {({ value2 }) => <div>Child2: {value2}</div>}
    </Context.Consumer>
  );
};
```

Po tej zmianie komponenty będą re-renderować się tylko, jeżeli zaszła zmiana w odpowiedniej informacji przechowywanej w kontekście.

### Kompletny przykład

> Otwórz konsolę w Code Sandbox by zobaczyć informacje dotyczące re-renderowania się komponentów.

<iframe src="https://codesandbox.io/embed/x3jrmjk1xo" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
