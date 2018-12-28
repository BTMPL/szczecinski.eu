---
title: Arrow functions
---

arrow functions (zwane także "fat arrow") to nowy sposób deklarowania funkcji wprowadzony w ES6, którego główną cechą jest to, że automatycznie przechwytuje ona wartość `this` dla momentu zadeklarowania, nie wywołania funkcji. Nowa składnia najczęściej przydaje się w przypadku wywołań zwrotnych (ang. callback) lub funkcji wywoływanych w timerach.

Dodatkową właściwością jest to, że w przypadku kiedy ciało funkcji składa się tylko z jednego wyrażenia zostanie ono automatycznie zwrócone, co pozwala na tworzenie wizualnie krótszego kodu.

Automatyczne przechwytywanie `this` działa dokładnie tak samo jak użycie funkcji prototypowej `Function.prototype.bind` ale pozwala nam "nie martwić" się o to. Minusem może okazać się to, że nie możemy zmienić `this`, jakie przypisane jest do funkcji tego typu.

```jsx
function a() {
  setTimeout(function() { console.log(this) })                
}

new a(); // Window lub undefined w strict

function b() {
  setTimeout(() => { console.log(this) });
}
new b(); // b{}
```

Jeżeli funkcja posiada tylko jedno wyrażenie, możemy pominąć nawiasy `{}` a wartość wyrażenia zostanie zwrócona domyślnie.

Składnia ulega nieco zmianie, jeżeli nasza funkcja powinna zwrócić obiekt.

```jsx
const a = () => 42;
console.log(a()); // 42

const b = () => ({
  test: 1
});

console.log(b()); // { test: 1 }
```