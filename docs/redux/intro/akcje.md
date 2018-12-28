---
title: Akcje
---

Akcją w Reduxie nazywamy obiekt, który posiada właściwość `type`, typu `string` nadającą nazwę wykonywanej właśnie operacji:

```js
const incrementCounter = {
  type: 'INCREMENT_COUNTER'
};
```

Poza typem, akcje zwykle zawierają dodatkowe informacje, na podstawie których reducer modyfikuje stan:

```js
const incrementCounter = {
  type: 'INCREMENT_COUNTER',
  by: 10
};
```

Często również spotkamy się z sytuacją, w której wartość `type` nie jest bezpośrednio łańcuchem znaków, ale stałą:

```js
const INCREMENT_COUNTER = 'INCREMENT COUNTER';
const incrementCounter = {
  type: INCREMENT_COUNTER,
  by: 10
};
```

Zabieg taki ma na celu umożliwienie wykorzystania tej samej wartości w kilku miejscach aplikacji i uniknięcie literówek (np. poprzez importowanie zmiennej, auto-complete naszego IDE).

## aciton creators

Kreatory akcji to funkcje, które zwracają akcję. Przydają się wszędzie tam, gdzie konieczne będzie parametryzowanie akcji:

```js

const INCREMENT_COUNTER = 'INCREMENT COUNTER';
const incrementCounter = (byHowMuch) => {
  return {
    type: INCREMENT_COUNTER,
    by: byHowMuch
  }
};
```

## flux standard action

Redux nie wymaga, by akcja posiadała jakiekolwiek zdefiniowane właściwości (inne niż `type`), jednak w aplikacjach tworzonych w tym tutorialu - a także waszych własnych aplikacjach - będziemy stosować notację znaną jako [flux standard action](https://github.com/redux-utilities/flux-standard-action).

Jest to powszechnie stwosowany wzorzec pozwalający na szybkie identyfikowanie tego, czy akcja zakończyła się powodzeniem czy też nie.

## Jakie typy danych mogę umieścić w akcji?

Co prawda Redux nie nakłada na nas żadnych dodatkowych ograniczeń technologicznych, ale w celu pełnego wykorzystania możliwości jakie oferuje, musimy pamiętać, żeby wszystkie elementy akcji były obiektami, które można zserializować używając `JSON.stringify`.

Jeżeli w naszej akcji (lub stanie!) umieścimy dane, których nie można zserializować możemy utracić niektóre możliwości, takie jak time travel czy zapisywanie i odtwarzanie stanu.