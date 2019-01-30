---
title: Czym jest Redux
---

Redux to "przewidywalny, scentralizowany, łatwy do debugowania i elastyczny" manager stanu.

Jednym z założeń React jest jednokierunkowy przepływ danych w aplikacji - wszelkie dane wpływają do naszego komponentu, który nie powinien ich mutować - jeżeli potrzebuje je zaktualizować, wykonuje to poprzez wywołanie `this.setState` lub callbacku przekazanego przez rodzica. 

Aby ułatwić zarządzanie stanem w bardziej złożonych aplikacjach Facebook zaproponował architekturę oraz bibliotekę [flux](https://facebook.github.io/flux/), której Redux jest rozwinięciem. Mimo, że najczęściej używany jest w połączeniu z React, można zastosować go w aplikacjach opartych o inne frameworki lub czysty JavaScript.

Idea Redux opiera się o założenie, że stan aplikacji (dane) są wynikiem poprzedniego (w tym początkowego) stanu zmodyfikowanego przez akcje - dzięki temu założeniu możliwe jest łatwe testowanie, zapisywanie i wznawianie a także "podróż w czasie" (czyli nic innego jak undo i redo na poziomie całej aplikacji). Z technicznego punktu widzenia, Redux jest implementacją [wzorca publisher-subscriber](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern).

```js
Widok -> Akcja -> Reducer -> Store -> Widok
  |        |         |         |        |
  + umożliwia zmianę |         |        |
           |         |         |        |
           + opisuje zmianę    |        |
                     |         |        |
                     + wprowadza zmianę w oparciu o stary stan i akcję
                               |        |
                               + zapisuje nowy stan i informuje o zmianie
                                        |
                                        + odzwierciedla zmianę w UI
```

Manager stanu powinien być także niezależną od UI warstwą aplikacji - w tym celu Redux (w połączeniu z React) stosuje terminy takie jak "smart component" ("container") i "dumb component" ("presentational component"). Nie będziemy jednak skupiać się na nich w tym tutorialu.

## Czy warto uczyć się Reduxa w 2019?

W 2018 roku twórcy React wprowadzili (lub zapowiedzieli) wiele narzędzi pozwalających na pierwszy rzut oka wyeliminować Redux - mówię tutaj o Context API oraz React Hooks. Również po zapowiedzi Suspense pojawiły się liczne wątki oraz wpisy na blogach wieszczące śmierć Reduxa. Ten jednak trzyma się mocno, głównie z uwagi na to, że Redux to nie tylko mechanizm przekazywania danych pomiędzy komponentami (coś, co miałby zastąpić Context), mechanizm cachowania danych (Suspense) czy abstrakcja logiki (Hooks). Redux to zestaw dobrych praktyk, narzędzi i rozszerzeń, które jeszcze przez długi czas będą istotne.

Redux nie jest też niczym skomplikowanym, na naukę czego musielibyśmy poświęcić wiele tygodni.