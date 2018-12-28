---
title: Parametry domyślne, destructuring i rest
---

Funkcje mogą od teraz deklarować wartości domyślne dla parametrów, dzięki czemu nie ma potrzeby rozwiązywania tego problemu w ciele funkcji. Dodatkowo pojawia się możliwość destrukturyzacji, czyli wybierania tylko niektórych kluczy z obiektów i tablic.

W odróżnieniu od innych języków, wartości domyślne mogą być dodane do dowolnej zmiennej, nie ma konieczności definiowania wartości domyślnych do wszystkich zmiennych kolejnych po tej, która deklaruje swoją wartość domyślną. W JS wszystkie nie przekazane zmienne otrzymują wartość `undefined`.

```jsx
function test(a, b = 42, c) {
  console.log(a, b, c);
}
test(); // undefined, 42, undefined
```

## destrukturyzowanie

Destrukturozywanie przydaje się wszędzie tam, gdzie wiemy, że funkcja wywoływana będzie z obiektem / tablicą, ale interesują nas tylko wybrane klucze.

Oczywiście i w tym wypadku możemy nadać zmiennym wartości domyślne.

```jsx
function testObject({ jeden = 42 }) {
  console.log(jeden);
}

testObject({jeden: 1, dwa: 2}); // "1"
testObject({dwa: 2}); // "42"

function testArray([jeden]) {
  console.log(jeden);
}
testArray(["jeden", "dwa"]); // "jeden"
```

## Operator rest

Istnieje także możliwość przechwycenia wielu parametrów do jednej zmiennej. Możemy przechwycić wszystkie parametry, lub zadeklarować listę parametrów, które chcemy pobrać oddzielnie, oraz pobrać pozostałe do tablicy.

```jsx
function test(...input) {
  console.log(input);
}              
test(1,2,3); // [1,2,3]

function testOgraniczony(pierwszy, ...input) {
  console.log(pierwszy, input);
}
testOgraniczony(1,2,3); // 1, [2,3]
```