---
title: mapStateToProps
---

Pierwszym argumentem, jaki zwyczajowo przekazujemy do `connect()` jest funkcja, której zadaniem jest mapowanie stanu reduxa na propsy komponentu - z tego też powodu nazywamy ją `mapStateToProps` (oczywiście to jak nazwiesz swoją funkcję, zależy tylko i wyłącznie od Ciebie, możesz też użyć anonimowej funkcji i przesłać ją bezpośrednio jako argument).

```js
const mapStateToProps = (state) => {
  console.log(state);
  return state;
}
```

Jeżeli przypomnimy sobie kształt naszego store z sekcji [Wiele reducerów](redux/intro/wiele-reducerow.md), wiemy, że efektem będzie:

```js
{
  counter: 0,
  hello: 0
}
```

Nasz komponent nie jest zainteresowany informacją `hello` a jedynie `counter`. Możemy to zapisać jako:

```js
const mapStateToProps = (state) => {
  return {
    counter: state.counter
  }
};

const App = (props) => (
  <div>
    <button onClick={() => {
      dispatch({
        type: 'CLICK'
      })
    }}>Kliknięto {props.counter} razy</button>
  </div>
);

const ConnectedApp = connect(mapStateToProps)(App);
```
[Uruchom w codesandbox](https://codesandbox.io/s/xro313jv0w)

W ten sposób nasz komponent otrzymuje tylko i wyłącznie informacje zapisane w `store.getState().counter`. Żadne inne informacje go nie interesują i ich zmiana nie spowoduje re-renderowania się komponentu. W celu stworzenia poprawnej architektury komponentu powinniśmy zadbać o to, by `mapStateToProps` tak poinstruowało `connect` by do komponentu trafił tylko te informacje, które go interesują.

## ownProps

`mapStateToProps` wywoływany jest z drugim parametrem, który stanowi odzwierciedlenie propsów jakie otrzymał nasz komponent od swojego rodzica. Jeżeli założymy następującą strukturę:

```js
ReactDOM.render(
  <ConnectedApp instanceId={42} />
);
```

Komponent `App` otrzyma propsy:

- `counter` przekazany z Reduxa za pomocą `connect` i `mapStateToProps`
- `dispatch` przekazany z Reduxa za pomocą `connect` 
- `instanceId` przekazany przez `ReactDOM.render()`

Zaś sama funkcja `mapStateToProps` otrzyma jako drugi argument obiekt:

```js
{
  instanceId: 42
}
```

Mechanizm ten przydaje się wszędzie tam, gdzie nie interesuje nas całość informacji przechowywanych w Reduxcie ale jedynie jej podzbiór - np. w celu sortowania, filtrowania etc. Więcej na ten temat dowiesz się z sekcji [Selektory](redux/extra/selektory.md).