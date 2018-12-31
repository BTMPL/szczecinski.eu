---
title: Przekazywanie danych w relacji rodzic : dziecko
---

Nasza aplikacja wciąż działa poprawnie, mamy już kilka komponentów, które możemy wykorzystywać (teraz lub w przyszłości) w innych częściach aplikacji, jednak komponenty te decydują nie tylko o tym jak dane są prezentowane, ale także o tym jakie dane są prezentowane - stanowczo nie jest to przydatne, kiedy chcemy używać tego samego komponentu (np. `<TweetTime />`) dla wielu różnych przypadków.

React sugeruje nam przekazywanie danych w jednym kierunku (ang. one way data flow) musi natomiast istnieć możliwość przekazywania danych z komponentu dziecka do komponentu rodzica. Za chwilę dowiesz się jak przekazywać dane "w dół" - z komponentu rodzica do komponentu dziecka. O tym jak przekazać dane w drugą stronę dowiesz się z dalszych rozdziałów, kiedy poruszymy tematy związane z formularzami.

Parametry przekazywane od rodzica do dziecka w React nazywamy `props`. Props zapisujemy podobnie jak atrybuty w HTML. Wartości tekstowe przekazujemy otoczone cudzysłowem (nie ma znaczenia czy będzie to pojedyncze czy podwójne cudzysłowie), wartości dynamiczne otaczamy natomiast znacznikami `{}`. Jako wartości dynamiczne możemy przekazać zarówno zmienne jak i wyrażenia dokładnie tak samo jak w przypadku ES6 template literals.

W przypadku komponentów bezstanowych, props zostaną przekazane do naszej funkcji jako pierwszy parametr w postaci obiektu, którego klucze odpowiadają nazwom propów.

Zmodyfikowany kod zawiera kilka zmian, którym warto się przyjrzeć:

*   props przekazywane są do komponentu dokładnie tak samo jak atrybuty do elementu HTML i obowiązują te same zasady przekazywania wartości zdefiniowanych jako kod JS
*   komponenty bezstanowe jako parametr przyjmują obiekt, zawierający wszystkie przekazane wartości
*   komponenty stanowe props otrzymują jako pole `this.props`
*   jeżeli liczba parametrów jest niewielka, warto użyć "destrukrutyzacji" i wyciągnąć z obiektu interesujące nas zmienne
*   props mogą być bez problemu przekazywane z komponentu do komponentu

Teraz nasze komponenty (`TweetTime` i `TweetUser`) nie decydują już o tym jakie dane mają wyświetlić, a jedynie jak dzięki czemu możemy wykorzystać je przy innych Tweetach albo przy innych częściach naszego UI.

Każdy komponent, który zawiera w sobie jakieś elementy (komponenty, HTML) otrzymuje także niejawnie jeden dodatkowy props - `props.children`, który zawiera właśnie te komponenty.

W niektórych przykładach zobaczysz składnię `propName={{ }}` - bez obaw! Po prostu do propsu `propName` przekazujemy obiekt JS!

```jsx
import React from "react";
import ReactDOM from "react-dom";

const TweetTime = (props) => {
  const date = `${props.date.getDate()} ${props.date.toLocaleString('pl-pl', { month: "long" })}`;
  return <time>{date}</time>
}
const TweetUser = ({ name, handle }) => <span><b>{name}</b> @{handle}</span>;

class Tweet extends React.Component {

  render() {
    const { user, text, date } = this.props.tweet;
    return (
      <div>
        <TweetUser name={user.name} handle={user.handle} /> -
        <TweetTime date={date} />
        <p>
          {text}
        </p>
      </div>
    )
  }
}

const TweetData = {
  user: {
    name: "Bartosz Szczeciński",
    handle: "btmpl"
  },
  date: new Date(),
  text: "Witaj świecie!"
}

ReactDOM.render(<Tweet tweet={TweetData} />, document.getElementById('root'));
```

<iframe src="https://codesandbox.io/embed/mqqwrlvwn9" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

> #### Uwaga
> Jeżeli komponent zawiera tylko jeden bezpośredni komponent potomny, `props.children` będzie właśnie tym komponentem, lecz jeżeli komponent zawiera więcej niże jeden bezpośredni komponent potomny, `props.children` będzie tablicą komponentów. W celu zapewnienia spójnej obsługi takich sytuacji zaleca się użycie API [React.Children](https://reactjs.org/docs/react-api.html#reactchildren).
