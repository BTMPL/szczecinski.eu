---
title: Listy komponentów - renderowanie bez rodzica
---

W poprzednich rozdziałach mogliśmy zauważyć, że wszędzie tam gdzie renderujemy, lub zwracamy JSX, zwracany jest jeden nadrzędny komponent, który zawiera w sobie wiele "sąsiadujących" komponentów. Rozwiązanie to było obowiązkowe w React <= 15 i sprawiało problemy przy pracy z flexbox czy tabelami.

Począwszy od React 16.2 możliwym stało się stosowanie nowej składni z użyciem `React.Fragment`.

W kodzie po prawej zmieniliśmy chwilowo nasz komponent tak, by renderował dwa Tweety, owinięte w jeden `<div>`. Nie zawsze jest to pożądane wyjście. Możemy zatem zmodyfikować nasz komponent tak, by wyrenderowany kod nie zawierał tego dodatkowego znacznika.

Więcej o Fragmentach przeczytasz na stronie [reactjs.org/docs/fragments.html](https://reactjs.org/docs/fragments.html).

```jsx
const TweetList = ({ tweets }) => {                
  return (
    <React.Fragment>
      <Tweet tweet={tweets[0]} />,
      <Tweet tweet={tweets[1]} />
    </React.Fragment>
  );
}    
```

Istnieje także skrócona notacja tego mechanizmu jednak może ona nie być wspierana przez Twój boilerplate:

```jsx
const TweetList = ({ tweets }) => {                
  return (
    <>
      <Tweet tweet={tweets[0]} />,
      <Tweet tweet={tweets[1]} />
    </>
  );
} 
```

> #### Uwaga
> Jeżeli korzystasz z React w wersji >16 i < 16.2 możesz skorzystać z biblioteki [react-aux](https://github.com/gajus/react-aux) aby móc stosować uproszczoną składnię z identycznym rezultatem.