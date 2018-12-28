---
title: Klasy
---

Klasy wprowadzone w ES2015 nie są pełnoprawnym konstruktem, tak jak ma to miejsce w językach programowania zorientowanych obiektowo (ang. Object Oriented) - stanowią one jedynie warstwę abstrakcji nad standardowym dla JS dziedziczeniem opartym o dziedziczenie prototypowe.

```jsx
// kod ES6
class Person {
  constructor(name) {
    this.name = name;
  }
}              

const obj = new Person("Bartek");
```

```jsx
// kod ES5
function _classCallCheck(instance, Constructor) { 
  if (!(instance instanceof Constructor)) { 
    throw new TypeError("Cannot call a class as a function"); 
  } 
}

var Person = function Perons(name) {
  _classCallCheck(this, Perons);

  this.name = name;
};

var obj = new Person("Bartek");
```

Każda klasa może zawierać wiele funkcji składowych - w JS wszystkie one są dostępne jako `public`. W celu odwołania się do funkcji składowej z wewnątrz klasy używamy zapisu `this.nazwaFunkcji()`. W celu odwołania się z zewnątrz, używamy `instancjaKlasy.nazwaFunkcji()`. Podobnie sprawa ma się w przypadku dostępu do zmiennych.

W celu zdefiniowania wartości statycznych, używamy notacji `NazwaKlasy.nazwaPola = 42` poza ciałem klasy.

> #### Uwaga
> Definicje klasy nie są hoistowane - oznacza to, że w odróżnieniu od funkcji, nie jesteśmy w stanie użyć klasy, a następnie ją zdefiniować.

```jsx
// błąd! klasa nie została jeszcze zdefiniowana
const blad = new Person();

class Person {
  constructor(name) {
    this.name = name ? name : Person.defaultName;
  }

  sayName() {
    console.log(`Witaj ${this.name}!`);
  }
}                    
Person.defaultName = "Anonim";

// utworzenie nowej instancji klasy
const obj = new Person("Bartek");

// wywołanie metody na instancji
obj.sayName(); // Witaj Bartek!

// dostęp do zmiennej (pola) na instancji
console.log(obj.name); // Bartek

// dostęp do zmiennej statycznej
console.log(Person.defaultName); // Anonim
```

## Poza ES6

W aktualnej wersji JS nie możemy korzystać z określeń typu `static` etc. czy też definiować zmienne bezpośrednio w ciele klasy - ale jeżeli używamy CRA, lub dodamy obsługę [class properties](https://babeljs.io/docs/plugins/transform-class-properties/) do naszego projektu będzie to możliwe.

Jest to zabieg który znacznie ułatwi nam pracę z komponentami klasowymi więc jest zdecydowanie zalecany.

```jsx
class Person {
  // zamiast używać this.name w konstruktorze dla wartości nie-dynamicznych
  name = '';

  // zamiast zapisywać Person.defaultName poza klasą
  static defaultName = 'Anonim';

  // zamiast używać zapisu this.handleClick.bind() w konstruktorze
  handleClick = () => { }
}
```