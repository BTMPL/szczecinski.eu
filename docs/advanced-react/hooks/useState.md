---
title: useState
---

`useState` jest jednym z podstawowych Hooków, który pozwala na przechowywanie i aktualizowanie stanu w komponentach opartych o funkcje. W podstawowym przypadku możemy skorzystać z niego poprzez wywołanie funkcji z początkową wartością:

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

Aby zademonstrować mechanizm działania `useState` utwórzmy komponent prostego licznika, który po kliknięciu guzika zwiększa swoją wartość o 1. Tworząc komponent oparty o klasynapisalibyśmy:

```jsx
class Counter extends React.Component {
  state = { value: 0 }

  return (
    <button onClick={() => {
      this.setState({
        value: this.state.value + 1
      })
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

### updater

Podobnie jak `this.setState`, również `useState` pozwala na wywołanie funkcji aktualizującej stan przekazując do niej nie nową wartość, ale funkcję, która zostanie wywołana z aktualnym stanem i powinna zwrócić zaktualizowany stan. Rozważmy następującą aplikację, tworzącą prosty stoper:

```jsx
const [state, setState] = useState(0);

// Więcej o tym Hooku dowiesz się z kolejnego rozdziału - na razie wiedz, że działa
// on tak jak funkcja `componentDidMount`
useEffect(() => {
  setInterval(() => {
    setState(state + 1);
  }, 1000);
}, []);
```

Na pierwszy rzut oka wydało by się, że działa on poprawnie - po zamontowaniu uruchomi interwał, który co sekundę zaktualizuje stan wywołując go z wartością "aktualny stan + 1". Nie zadzieje się tak, ponieważ wartość zmiennej `state` wewnątrz `setInterval` przechwycona jest tylko raz (w momencie pierwszego renderowania komponentu) i to przez wartość, a nie referencję. Zamiast tego możemy użyć zapisu:

```jsx
const [state, setState] = useState(0);

useEffect(() => {
  setInterval(() => {
    setState(state => state + 1);
  }, 1000);
}, []);
```

## Kolejność wykonywania Hooków jest istotna!

Co stanie się jeżeli wyrenderujemy:

```jsx
<React.Fragment>
  <Counter />
  <Counter />
</React.Fragment>
```

Czy po kliknięciu w jeden guzik zmianie ulegnie wartość drugiego? **Nie.** React nie używa wartości początkowych ani innych danych do rozróżnienia poszczególnych Hooków - korzysta z kolejności ich wywołania, która śledzona jest wewnętrznie przez React per-komponent.

Jeżeli utworzymy komponent zawierający wywołanie `useState` w różnych kolejnościach, np:

```jsx
const User = () => {
  const [firstName, setFirstName] = useState("");
  if (firstName) {
    // Nazwisko nie jest nam potrzebne, do czasu aż użytkownik poda swoje imie
    const [lastName, setLastName] = useState("");
  }
  const [email, setEmail] = useState("");

  return (
    <div>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      <br />
      {firstName && (
        <React.Fragment>
          <input value={lastName} onChange={e => setLastName(e.target.value)} />
          <br />
        </React.Fragment>
      )}
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </div>
  );
};
```

Powodowało by to kilka problemów:

- po pierwsze, z uwagi na block-level scope, `lastName` i `setLastName` dostępne są tylko w swoim bloku, więc nie możemy użyć ich w JSX,
- jeżeli obejdziemy to używając np. `var`, wprowadzimy wartość w pole z emailem i następnie w pole z imieniem, okaże się, że wartość email została przeniesiona do pola na nazwisko

Dzieje się tak, ponieważ dodaliśmy wywołanie nowego hooka, tym samym zmieniając ich kolejność - w takiej sytuacji React nie zauważa wstawienia nowego `useState` w środek, i po prostu uznaje, że drugie wywołanie jest wywołaniem dla emaila, ponieważ tak było w poprzednim cyklu.
