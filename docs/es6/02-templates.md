---
title: Template strings, tagged template strings
---

## template strings

Definiowanie łańcuchów tekstowych, które zawierały w sobie dynamiczny kod, lub rozciągały na wiele linii było dosyć nie wygodne, dlatego w ES6 wprowadzono nowy typ łańcuchów tekstowych - template strings. Aby je zdefiniować, tekst otaczamy znacznikami `` ` ``.

Jeżeli tekst zostanie owinięty znacznikami `` ` `` będzie on traktowany jako łańcuch tekstowy i wszelkie znaki specjalne zostaną potraktowane dosłownie aż do napotkania kolejnego znacznika `` ` ``.

Jeżeli chcemy w takim łańcuchu osadzić wartość dynamiczną używamy zapisu `${wyrażenie}`

```javascript
const a = `klasyczny łańcuch tekstowy`;
const b = `łańcuch tekstowy
w wielu liniach`;

const c = `łańcuch z osadzoną zmienną: ${a}`
```

## tagged template strings

Template literals można użyć także do wywołania funkcji - zapis ten może wydawać się nieco dziwny, ale jest on popularny w niektórych rozwiązaniach np. w bibliotece styled-components

```jsx
function logToConsole(input) {
  console.log("Loguję: ", input);
}            

logToConsole`Witaj świecie!`; // "Loguję: ", ["Witaj świecie"];

const Component = styled.div`
  color: 'red'
`;
```