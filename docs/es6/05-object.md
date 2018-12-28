---
title: Skrócona notacja obiektowa, dynamiczne właściwości obiektu, spread
---

Praca z obiektami stała się także o wiele wygodniejsza - głównie za pośrednictwem wprowadzenia nowych notacji na istniejącą już funkcjonalność.

## Skrócona notacja obiektowa

Jeżeli chcemy zadeklarować obiekt, który używać będzie zmiennych dla wartości kluczy, a nazwa tych kluczy powinna być taka sama jak nazwa zmiennych możemy pominąć ich wartość w czasie deklarowania.

```jsx
const test = 42;
const obj = {
  test
};
console.log(obj.test); // 42
```

## Dynamiczne właściwości obiektów

Często zdarza się również, że chcemy utworzyć klucze w oparciu o nazwy zmiennych - do tej pory mogliśmy wpierw utworzyć obiekt, a następnie używając dostępu tablicowego dodać wartość. Teraz możliwe jest bezpośrednie tworzenie takich kluczy.

```jsx
const test = "myKey";
const obj = {
  [test]: 42
};
console.log(obj.myKey); // 42
```

## Spread (Array i Object)

Pojawia się także nowa składnia pozwalająca na kopiowanie obiektów - zastępuje ona funkcjonalność taką jak `splice` czy `concat`.

ES6 obsługuję te notację jedynie w przypadku tablic, ale istnieje proposal dodający wsparcie również w przypadku obiektów. W świecie React jest on na tyle popularny, że warto o nim wspomnieć.

```jsx
const source = [1, 2];
const copy = [...source]; // [1, 2];
const append = [...source, 3]; // [1, 2, 3];
const prepend = [0, ...source]; // [0, 1, 2];

const obj = { test: 1, test2: 2 };
const copyObj = { ...obj, test3: 3 }; // { test: 1, test2: 2, test3: 3 }
const copyWithOverwrite = { ...obj, test2: 3 }; // { test: 1, test2: 3 }
```

> #### Uwaga
> Kopie tego typu są kopiami płytkimi - w przypadku wielowymiarowych tablic, tablic obiektów etc. uzyskamy kopię referencji. Uważajmy więc, by nie mutować oryginalnych danych!
> ```jsx
> const source = [
>   { test: 1 }
> ];
> const copy = [...source];
> copy[0].test = 2;
> console.log(source[0].test); // 2
> ```