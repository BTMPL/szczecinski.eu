---
title: Pozostałe hooki
---

React oferuje jeszcze [kilka innych Hooków](https://reactjs.org/docs/hooks-reference.html):

- `useCallback`
- `useMemo`
- `useRef`
- `useImperativeHandle`
- `useLayoutEffect`
- `useDebugValue`

Większość z nich nie będziesz wykorzystywać na codzień - wspomnijmy tylko kilka z nich.

## `useMemo`

Hook `useMemo` udostępnia prosty mechanizm memoizacji danych, pozwalający np. na wywoływanie "ciężkiej" w obliczeniach funkcji tylko kiedy jest konieczna, a nie przy każdym re-renderowaniu się komponentu.

Hook ten wywołujemy z dwoma elementami - funkcją, stanowiącą "generator" danych oraz tablicą wartości, których zmiana powinna wywołać odświeżenie danych (podobnie jak `useEffect`):

```jsx
const Graph = props => {
  // komponent Item otrzymuje dane o elementice aplikacji i dokonuje przekształceń,
  // np na podstawie danych biznesowych generuje dane dla wykresu. Operacja taka może być zasobożerna

  const graphData = useMemo(() => convertToGraphData(props.data), [props.data]);

  return <BarChart data={graphData} />;
};
```

## `useRef`

Hook ten umożliwia dostęp do mechanizmu referencji do elementów DOM, który w komponentach klasowych możliwy jest za pomocą `React.createRef`. Rozważmy komponent pozwalający na wprowadzenie kodu pocztowego:

```jsx
const ZipCode = () => {
  const [zip1, setZip1] = useState("");
  const [zip2, setZip2] = useState("");

  return (
    <React.Fragment>
      <input
        type="text"
        maxLength="2"
        onChange={e => setZip1(e.target.value)}
      />
      <input
        type="text"
        maxLength="3"
        ref={zip2Ref}
        onChange={e => setZip2(e.target.value)}
      />
    </React.Fragment>
  );
};
```

Jeżeli chcielibyśmy doń dodać logikę, pozwalającą na automatyczne przeniesienie kursora do drugiego pola w momencie, kiedy wprowadzimy pierwsze dwa znaki możemy skorzystać właśnie z `useRef`:

```jsx
const ZipCode = () => {
  const [zip1, setZip1] = useState("");
  const [zip2, setZip2] = useState("");

  const zip2Ref = useRef(null);
  return (
    <React.Fragment>
      <input
        type="text"
        maxLength="2"
        onChange={e => {
          setZip1(e.target.value);
          if (e.target.value.length === 2) zip2Ref.current.focus();
        }}
      />
      <input
        type="text"
        maxLength="3"
        ref={zip2Ref}
        onChange={e => setZip2(e.target.value)}
      />
    </React.Fragment>
  );
};
```

`useRef` może być używany do przechowywania innych danych, nie tylko referencji do DOM. Możesz użyć go wszędzie tam, gdzie asynchronicznie potrzebny jest dostęp do niemutowalnych danych.

Przykładowo, jeżeli chcemy utworzyć aplikację zawierającą stoper (który znamy już z sekcji `useState`), którego użyjemy do zmierzenia czasu jaki zajmuje asynchroniczna operacja:

```jsx
const [state, setState] = useState(0);

useEffect(() => {
  setInterval(() => {
    setState(state => state + 1);
  }, 1000);

  // udajmy, że operacja zajmuje 5 sekund
  new Promise(resolve => {
    setTimeout(resolve, 5000);
  }).then(() => {
    console.log(`Operacja asynchroniczna trwała ${state} sekund.`);
  });
}, []);
```

Po 5 sekundach w konsoli otrzymamy informację wskazującą, że operacja trwała 0 sekund - stan znów został przechwycony przez wartość. Zmodyfikujemy zatem naszą aplikację:

```jsx
const [state, setState] = useState(0);

// Utwórz referencję - zdarzenie to odbywa się tylko raz, w następnych wywołaniach
// zwrócona zostanie już istniejąca w pamięci referencja
const stateRef = useRef();

// Zapisz aktualną wartość stanu do referencji
stateRef.current = state;

useEffect(() => {
  setInterval(() => {
    setState(state => state + 1);
  }, 1000);

  // udajmy, że operacja zajmuje 5 sekund
  new Promise(resolve => {
    setTimeout(resolve, 5000);
  }).then(() => {
    // Pobierz wartość z referencji, nie stanu
    console.log(`Operacja asynchroniczna trwała ${stateRef.current} sekund.`);
  });
}, []);
```
