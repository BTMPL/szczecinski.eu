---
title: Kod asynchroniczny - Promise
---

Duża część pracy z JS zwiazana jest ze operacjami, które nie dzieją się od razu - odpytywanie zewnętrznych serwerów, oczekiwanie na skomplikowane obliczenia czy wykonanie się innego kawałku kodu. Jako, że JS jest jedno wątkowy, wykonywanie tego typu operacji na głównym wątku powodowałoby zablokowanie go - w rezultacie blokowało by także interakcję z UI etc.

Dotychczasowo problem ten rozwiąznywany był przy użyciu callbacków - funkcje były wywoływane z inną funkcją, która była następnie wywoływana kiedy główne zadanie zostało wykonane. Kod taki stawał się nieczytelny i bardzo szybko można było przestać orientować się w jaki sposób przebiega egzekucja aplikacji.

W celu rozwiązania problemu w ES6 wprowadzono pojęcie Promise (z ang. "obietnice"), które raz rozpoczęte mogą zakończyć pozytywnie lub negatywnie, a nasza aplikacja może "zasubskrybować" oba te zdarzenia.

## Promise

W celu utworzenia własnego Promise używamy konstruktora `new Promise` przekazując 2 callbacki - `resolve` i `reject`.

W celu "zasubskrybowania" pomyślnego wykonania się Promise, na zwróconym obiekcie używamy metody `.then`, która jako parametr przyjmuje wartość, z jaką "wykonał" się Promise. W celu zasubskrybowania niepoprawnego wykonania, używamy analogicznie metody `.catch`.

Samo Promise powinno zaś wywołać `resolve` jeżeli wszystko zakończyło się sukcesem, lub `reject` jeżeli operacja nie powiodła się. Wartość, z jaką zostaną wywołane w/w funkcje przekazywana jest odpowiednio do `then` oraz `catch`.

```jsx
const getPromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(42);
    }, 1000);
  });
}

alert('Tworze Promise');
getPromise().then(value => {
  alert('Promise wykonane, wartość: ' + value);
});
alert('Promise utworzone pomyślnie');
```

Promise może występować jedynie w jedynym z 3 stanów: nie wykonany, wykonany pomyślnie i wykonany niepomyślnie. Jeżeli użyjemy `.then`lub `.catch` na Promise które już wcześniej było wykonane pomyślnie/niepomyślnie, nasz "listener" zostanie wykonany w następnym cyklu interpretora JS.

Możliwe jest także utworzenie Promise które od razu będzie wykonane pomyślnie lub niepomyślnie używając `Promise.resolve()` lub`Promise.reject()`

```jsx
const resolvedPromise = Promise.resolve();
resolvedPromise.then(() => alert('Promise pomyślny!'));

const rejectedPromise = Promise.reject();
rejectedPromise.catch(() => alert('Promise zakonczony niepowodzeniem!'));

```

Promisy mogą być także łączone w łańcuchy (ang. chained) - jeżeli funkcja przekazana w `then` zwróci cokolwiek innego niż wartość falsy lub odrzucone Promise, kolejny `then` zostanie wykonany (i odpowiednio dla łańcuchów `catch`).

```jsx
const resolvedPromise = Promise.resolve();
resolvedPromise.then(() => {
    alert('Pierwszy Promise pomyślny!');
    return 42;
}).then((value) => alert('Poprzednie "then" przesłało dalej ' + value));
```

Dodatkowo, obiekt Promise zawiera dwa mechanizmy pozwalające na pracę z wieloma Promisami:

`Promise.all([Promise])` - utworzy Promise, który wykona się w momencie, kiedy wszystkie przekazane obiekty Promise wykonają się  
.`Promise.race([Promise])` - wywoła się w momencie, w którym wywoła się pierwszy z przekazanych obiektów Promise.

```jsx
Promise.all([
  new Promise(res => setTimeout(() => res(42), 1000)), // wykonaj po 1 sekundzie,
  new Promise(res => setTimeout(() => res(64), 2000)) // wykonaj po 2 sekundach
]).then(values => {
  alert('Wywołano z tablicą: ' + values.join(', '));
});
```

```jsx
Promise.race([
  new Promise(res => setTimeout(() => res(42), 1000)), // wykonaj po 1 sekundzie,
  new Promise(res => setTimeout(() => res(64), 2000)) // wykonaj po 2 sekundach
]).then(value => {
  alert('Wywołano z wynikiem: ' + value); // wywołane tylko dla pierwszego Promise!
});
```

> #### Uwaga
> Raz uruchomionego Promise nie da się anulować. Jeżeli zachodzi potrzeba anulowania, należy przewidzieć to w części `then`. Istnieje kilka rozwiązań tego problemu w postaci nieoficjalnych bibliotek.