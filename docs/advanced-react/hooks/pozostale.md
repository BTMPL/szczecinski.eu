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
        onChange={e => setZip1(e.target.value)}
      />
    </React.Fragment>
  );
};
```

Jeżeli chcieli byśmy doń dodać logikę, pozwalającą na automatyczne przeniesienie kursora do drugiego pola w momencie, kiedy wprowadzimy pierwsze dwa znaki możemy skorzystać właśnie z `useRef`:

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
        onChange={e => setZip1(e.target.value)}
      />
    </React.Fragment>
  );
};
```
