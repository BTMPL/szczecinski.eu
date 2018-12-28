---
title: Specyfikatory zasięgu - const, let
---

ES6 wprowadza dwa nowe typy zmiennych - `const` oraz `let`. Oba są widoczne jedynie w zasięgu lokalnym, w którym zostały zdefiniowane i powinny być używane zamiast dotychczasowego `var`. Zmiennych tego typu nie można też ponownie deklarować.

`const` używamy wszędzie tam, gdzie przypisanie do zmiennej nie będzie ulegać zmianie. Użycie tego typu nie oznacza że nie ma możliwości mutowania danych - jeżeli do zmiennej przypiszemy obiekt, wciąż możemy (lecz nie powinniśmy!) modyfikować jego wartości.

Jeżeli chcemy by nasz obiekt był całkowicie nie mutowalny, możemy użyć `Object.freeze`

```jsx
const a = 42;
a = 43; // błąd - nie można zmienić przypisania

const b = { theAnswerToLifeTheUniverseAndEverything: undefined }
b.theAnswerToLifeTheUniverseAndEverything = 42; // poprawnie

const c = { theAnswerToLifeTheUniverseAndEverything: undefined };
Object.freeze(c);
c.theAnswerToLifeTheUniverseAndEverything = 42; // błąd

const d = [];
d.push(42); // poprawnie
```

`let` jest podobny w działaniu do `var` dostępny jest on jednak tylko w zasięgu, w którym został zadeklarowany.

Dodatkową różnicą jest to, że w przypadku stosowania closure wartości zmiennej będą kopiowane, a nie przekazywane przez referencję.

```jsx
if(true) {
  var a = 42;
  let b = 42;
}
console.log(a); // 42;
console.log(b); // błąd - b nie jest zdefiniowane

// wyświetli dwa razy "2"
for(var i = 0 ; i < 2 ; i++) {
  setTimeout(function() { console.log(i) });
}              

// wyświetli "0" i "1"
for(let i = 0 ; i < 2 ; i++) {
  setTimeout(function() { console.log(i) });
}         
```