---
title: JSX
---

Nasza aplikacja działa, ale jest strasznie prosta - renderuje tylko zwykły string. Jeżeli spróbujemy dodać do niego znaczniki HTML zostaną one również potraktowane jako łańcuch tekstowy i wyświetlone jako tekst, nie jako znaczniki HTML.

React używa własnego języka znaczników - JSX, który stanowi rozszerzenie języka JS przy pomocy składni przypominającej XML. Nie jest to jednak ani XML, ani HTML, a co więcej znaczniki te nie są w żaden sposób interpretowane przez przeglądarkę - stanowią one jedynie ułatwienie dla developerów przy pracy z React. Jeżeli nie podoba nam się "umieszczanie HTML w JS" istnieje wiele alternatyw jak react-hyperscript czy też pisanie własnoręcznie wygenerowanego kodu.

> ### Uwaga
> Znaczniki JSX nie są interpretowane przez przeglądarkę i będą prowadzić do powstawania błędów. Od teraz wszystkie przykłady uruchamiaj w środowisku CRA lub innym boilerplate. Kod z tej sekcji umieść w pliku `src/index.js` i uruchom projekt poleceniem `npm start`. Jeżeli nie skonfigurowałeś jeszcze CRA zajrzyj do sekcji [Lekcja 1](/lekcja/lekcja1/create-react-app).

Uaktualnijmy zatem naszą aplikację tak, by wyglądała jak typowy Tweet. Dodamy trochę znaczników HTML oraz nieco więcej tekstu.

Po zapisaniu zmian na ekranie wyświetli nam się poprawnie sformatowany Tweet - nasz kod JSX został zamieniony na poprawną składnię HTML.

```jsx
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <div>
    <b>Bartosz Szczeciński</b> @btmpl - <time>11 Listopada</time>
    <p>
      Witaj świecie!
    </p>
  </div>
, document.getElementById('root'))
```

Dociekliwy developer zapyta się, po co importujemy `React` skoro nie jest on używany nigdzie w kodzie aplikacji (a niektóre IDE mogą także podkreślić nam to jako błąd). Musimy zaimportować ten obiekt, ponieważ JSX nie jest składnią, którą jest w stanie rozpoznać ani przeglądarka, ani webpack. JSX jest tłumaczony na wywołania JavaScript.

Po przekształceniu JSX na JS widzimy, że nasz każdy tag JS zamienił się w wywołanie `React.createElement`, które przyjmuje trzy argumenty:

*   nazwę elementu, który renderujemy
*   obiekt atrybutów, które przekazujemy do renderowanego elementu (więcej o tym w dalszych rozdziałach)
*   trzeci i kolejny parametr reprezentują elementy potomne

Z tej transformacji wynika kilka kilka ważnych ograniczeń JSX:

*   każde wywołanie `render()` jako parametr wejściowy może przyjąć tylko jeden element JSX (ale - elementem tym może być tablica elementów, lub element zawierający wiele innych elementów)
*   każdy znak musi zawierać się w znaczniku HTML, dlatego jeżeli chcemy wyrenderować spację pomiędzy dwoma elementami musimy użyć notacji  .

```jsx
import React from "react";
import ReactDOM from "react-dom";
            
ReactDOM.render(React.createElement(
  'div',
  null,
  React.createElement(
    'b',
    null,
    'Bartosz Szczeciński'
  ),
  ' @btmpl - ',
  React.createElement(
    'time',
    null,
    '11 Listopada'
  ),
  React.createElement(
    'p',
    null,
    'Witaj Świecie!'
  )
), document.getElementById('root'));    
```

Przykład kodu JSX przetransformowanego na JS za pomocą [https://babeljs.io/repl/](https://babeljs.io/repl/)

## Używanie JS w składni JSX

W kodzie JSX istnieje możliwość używania nie tylko stringów i znaczników HTML (oraz komponentów, o czym dowiesz się za chwilę), ale także kodu JS. Kod JS w JSX osadzamy dokładnie tak samo jak w przypadku template strings - w celu wskazania, że zamierzamy zamieścić kod JS otaczamy go znacznikami `{ }`, zaś sam kod jest bezpośrednio wywoływany i powinien on zwrócić wartość (nie możemy zatem bezpośrednio definiować obiektów, używać konstruktów if/else etc.).

Zmodyfikujmy zatem nasz kod tak, by data była zawsze aktualna:

```jsx
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <div>
    <b>Bartosz Szczeciński</b> @btmpl - 
    <time>{(new Date()).toString()}</time>
    <p>
      Witaj świecie!
    </p>
  </div>
, document.getElementById('root'));
```