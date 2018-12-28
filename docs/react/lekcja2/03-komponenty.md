---
title: Komponenty
---

Jedną z głównych zalet React jest możliwość tworzenia komponentów, które "ukrywają" nam szczegóły implementacji i pozwalają na szybkie dodawanie funkcjonalności do naszej aplikacji. Na przykład jeżeli chcemy dodać odtwarzacz video, dodajemy po prostu w kodzie JSX`<Video>` - brzmi to trochę jak tworzenie własnych tagów HTML i poniekąd tak wygląda. Zamieńmy zatem nasz Tweet w komponent React.

React wyróżnia dwa typu komponentów: komponent bezstanowy (ang. stateless functional component, SFC) będący funkcją, oraz komponent stanowy (ang. stateful functional component) reprezentowany przez klasę. Na początek utworzymy nasz komponent jako komponent SFC.

Utwórzmy zatem funkcję i zapiszmy ją do zmiennej `Tweet` (możesz również stworzyć normalną funkcję używając składni `function`ale dobrze jest znać różnice pomiędzy tymi dwiema składniami) i przenieśmy do niej nasz kod HTML. Funkcja ta po prostu zwraca kod JSX.

```jsx
import React from "react";
import ReactDOM from "react-dom";

const Tweet = () => (
  <div>
    <b>Bartosz Szczeciński</b> @btmpl - 
    <time>{(new Date()).toString()}</time>
    <p>
      Witaj świecie!
    </p>
  </div>
)

ReactDOM.render(
  <Tweet />
, document.getElementById('root'));
```

Następnym krokiem jest usunięcie tego kodu z wywołania `ReactDOM.render` i zastąpienie go `<Tweet />`.

Na skutek tej operacji zaktualizowany zostanie kod JS - zwróć uwagę, że dookoła `Tweet` nie ma w nim cudzysłowu.

```jsx
ReactDOM.render(
  React.createElement(Tweet, null), 
  document.getElementById('root')
);
```

## Komponenty stanowe

Wspomnianym drugim typem komponentów są komponenty stanowe - odróżnia je nie tylko to, że posiadają one stan, czyli mogą przechowywać dane odnośnie swojej reprezentacji (przykładowo komponent na wprowadzanie tekstu - `<input>` zawierałby informacje o aktualnie wpisanym tekście), ale posiadają też funkcje cyklu życia. Funkcje cyklu życia wywoływane są w określonych momentach i pozwalają na przygotowanie i sterowanie działaniem komponentu. Więcej dowiesz się o nich w dalszych rozdziałach, na razie przepiszmy nasz komponent na prosty komponent stanowy.

Komponenty stanowe opisywane są poprzez klasy i jeżeli nie miałeś jeszcze z nimi styczności polecam zapoznać się chociażby z podstawową składnią.

Komponenty stanowe opisywane są przez klasę `React.Component` i muszą implementować przynajmniej funkcję `render`, która zwraca kod JSX komponentu. Usuńmy zatem naszą zmienną Tweet i zamiast niej utwórzmy klasę.

Przy okazji usunęliśmy generowanie daty z samego JSX przez co nasz kod stał się nieco bardziej czytelny. Tę samą operację możemy też wykonać w komponentach bezstanowych!

Komponenty stanowe są nieznacznie wolniejsze niż komponenty bezstanowe dlatego wiele poradników lub presetów do ESlint zaleca ich stosowanie, jednak wybór ten nie wpływa na wydajność w aż tak znaczącym stopniu.

```jsx
class Tweet extends React.Component {

  render() {
    const date = (new Date()).toString();
    return (
      <div>
        <b>Bartosz Szczeciński</b> @btmpl - 
        <time>{date}</time>
        <p>
          Witaj świecie!
        </p>
      </div>                    
    )
  }
}
```

> #### Uwaga
> Nazwa naszego komponentu - Tweet - nie przypadkowo zaczyna się dużą literą. W ten sposób dajemy znać JSX, że chodzi nam o komponent, a nie o znacznik HTML. Jeżeli utworzymy komponent `header` i nie użyjemy wielkiej litery, podczas transformacji zostanie on potraktowany jako znacznik HTML i nie uzyskamy oczekiwanego efektu.

Możemy teraz wyrenderować listę kilku Tweetów, przekazując do ReactDOM.render tablicę obiektów lub tworząc jeden dodatkowy znacznik HTML, w którym przekażemy listę naszych Tweetów.

```jsx
ReactDOM.render(
  <div>
    <Tweet />
    <Tweet />
    <Tweet />
  </div>
, document.getElementById('root'));
```

> #### Uwaga
> Uwaga - jeżeli postanowiłeś użyć tablicy, nie przejmuj się chwilowo informacją o błędzie, jak React zgłasza w konsoli :)