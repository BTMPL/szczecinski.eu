---
title: Dekoratory
---

Dekoratory nie są w prawdzie jeszcze standardem ES, ale wszystko wskazuje na to, że staną się w kolejnych wersjach. Już teraz można je natomiast spotkać w popularnych bibliotekach tj. MobX czy react-dnd.

Dekoratory są zapewne znane wszystkim, mającym wcześniej styczność z Javą. Ich zadaniem jest modyfikowanie lub obserwowanie metod i klas. Obecnie nie ma możliwości stosowania dekoratorów bezpośrednio dla funkcji nie będących metodami klasy.

Dekoratory są definiowane jako funkcje, które przyjmują 3 parametry:

*   target - klasę, na której zostały zastosowane
*   nazwę - nazwę metody, na której są zastosowane; w przypadku dekorowania klas będzie to `undefined`
*   deskryptor - obiekt reprezentujący właściwości metody; w przypadku klas będzie to `undefined`

Deskryptor zaś składa się z 4 pól, które możemy mutować:

*   configurable - bool - określa, czy obiekt można konfigurować (np. usuwać)
*   enumerable - bool - czy wartość powinna być możliwa do enumeracji (używając `for x in obj`
*   writable - bool - określa, czy obiekt można nadpisać
*   value - mixed - referencja do obiektu

```jsx
const time = (target, name, descriptor) => {
  const original = descriptor.value;
  // Użyj function by umożliwić późne wiązanie this
  descriptor.value = function(...input) {
    console.time(name);
    original.apply(this, ...input)
    console.timeEnd(name);
  }
}

const readonly = (target, name, descriptor) => {
  descriptor.writable = false;
}

class Demo {                
  @time
  member() {
    console.log('Wywołano metodę "member"');
  }
  
  @readonly
  a = 5;
}

const obj = new Demo;
obj.member();
/**
 * Wywołano metodę "member"
 * member: 0.203857421875ms
 */

obj.a = 1;
console.log(obj.a); // 5
```