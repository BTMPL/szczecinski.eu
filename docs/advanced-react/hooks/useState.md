---
title: useState
---

`useState` jest jednym z podstawowych Hooków, który pozwala na przechowywanie i aktualizowanie stan w komponentach opartych o funkcje. W podstawowym przypadku możemy skorzystać z niego poprzez wywołanie funkcji z początkową wartością:

```js
const [stateValue, stateUpdate] = useState(1);
```

Wywołana w ten sposób funkcja zwróci tablicę z dwoma obiektami:

- wartość - początkowa lub zmieniona przez użytkownika
- funkcja - pozwalająca na aktualizację stanu.

## Dlaczego zwracana jest tablica

Gdyby funkcja `useState` (i inne Hooki) zwracała obiekt, możliwe było by użycie notacji:

```js
const { value, update } = useState(1);
```

Sprawa jednak komplikowała by się w przypadku, kiedy chcemy zdefiniować kilka stanów:

```js
const { value, update } = useState("Bartosz");

const {
  value, // błąd! zmienna value już istnieje
  update // błąd! zmienna update już istnieje
} = useState("Szczeciński");

// musimy napisać
const { value: nazwisko, update: zmienNazwisko } = useState("Szczeciński");
```

Składnia taka jest nie tylko mniej wygodna do pisania, jest ona także nieznacznie wolniejsza podczas wykonywania przez silniki JS (przynajmniej w przypadku V8).

## Przykład użycia

Aby zademonstrować mechanizm działania `useState` utwórzmy komponent prostego licznika, który po kliknięciu guzika zwiększa swoją wartość o 1. Tworząc komponent oparty o klasy napisali byśmy:

```jsx
class Counter extends React.Component {
  state = { value: 0 }

  return (
    <button onClick={() => {
      this.setState(state => ({
        value: state.value + 1
      }))
    }}>{this.state.value}</button>
  )
}
```

Przepisując ten sam komponent tak, by używał Hooków otrzymujemy:

```jsx
const Counter = ({ initialValue = 0 }) => {
  const [value, updateValue] = useState(initialValue);

  return (
    <button
      onClick={() => {
        updateValue(value + 1);
      }}
    >
      {value}
    </button>
  );
};
```

Komponent możemy utworzyć z określoną wartością początkową, lub zainicjować zerem. Przy użyciu `useState` generujemy jego stan i mechanizm aktualizacji. Możemy teraz wyrenderować go jako:

```jsx
<Counter initialValue={5} />
```

Co stanie się jeżeli wyrenderujemy:

```jsx
<React.Fragment>
  <Counter />
  <Counter />
</React.Fragment>
```

Czy po kliknięciu w jeden guzik zmianie ulegnie wartość drugiego? **Nie.** React nie używa wartości początkowych ani innych danych do rozróżnienia poszczególnych Hooków - korzysta z kolejności ich wywołania, która śledzona jest wewnętrznie przez React per-komponent.

## Kolejność wykonywania Hooków jest istotna!
