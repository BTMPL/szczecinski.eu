---
title: React.memo
---

Komponenty Reactowe renderują się zawsze, kiedy:

- ulega zmianie ich stan,
- ulegają zmianie ich props (re-renderuje się ich rodzic),
- komponent klasowy wywołuje `this.forceUpdate()`,
- zmianie ulega context, który subskrybują (`useContext`, `contextType`)

Zwykle nie jest to problem, ale czasem chcemy, by komponenty nie re-renderowały się ponownie, jeżeli nie jest to wymagane (np. ich re-renderowanie powoduje jakieś skomplikowane obliczenia albo efekty w layoucie tj. layout trashing, co powoduje pogorszenie wydajności aplikacji).

W komponentach klasowych możemy wykorzystać do tego metodę `shouldComponentUpdate`. W komponentach opartych o funkcje - na ten moment - nie istnieje możliwość by decyzja ta zapadła wewnętrznie (wytłumaczenie dlaczego nie jest to takie proste znajdziesz na [blogu Dana](https://overreacted.io/why-isnt-x-a-hook/#not-a-hook-usebailout)). Decyzję o tym, w jakich przypadkach komponent powinien się re-renderwować musimy podjąć w momencie jego deklaracji.

Jeżeli chcemy odtworzyć przykład `React.PureComponent` (komponentu, który nie re-renderuje się o ile zmianie nie uległ jego stan lub props), używamy `React.memo` przekazując jako parametr komponent (może to być także wykonane inline):

```jsx
const Expensive = React.memo(function Component(props) => {
  // wykonaj skomplikowane obliczenia
  const data = doExpensiveComputation(props.data);
  return <Graph data={data} />
});
```

## Precyzowanie warunków re-renderowania

Jak już wspominałem wcześniej, komponenty oparte o funkcje nie mają możliwości "rezygnacji" z renderowania w oparciu o stan, jedyne co mogą obserwować to propsy jakie dostają. Jeżeli potrzebujemy pełniejszej kontroli (np. chcesz oprzeć ten warunek tylko o konkretne propsy) możesz jako drugi parametr przekazać funkcję, która zostanie wywołana z poprzednim i nowymi propsami:

```jsx
const Expensive = React.memo(function Component(props) => {
  // wykonaj skomplikowane obliczenia
  const data = doExpensiveComputation(props.data);
  return <Graph data={data} />
}, (prevProps, nextProps) => {
  // re-renderuj się tylko, gdy zmienimy wartość propsu "data", w innym wypadku nie re-renderuj się
  if (prevProps.data !== nextProps.data) {
    return true;
  } else {
    return false;
  }
});
```
