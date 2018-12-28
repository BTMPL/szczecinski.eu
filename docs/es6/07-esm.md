---
title: Moduły
---

Jednym z problemów występującym w JavaScript od samego początku był problem braku przestrzeni nazw - każda utworzona przez nas zmienna czy funkcja, o ile nie osadzona w wewnątrz przestrzeni innej funkcji znajdowała się w przestrzeni globalnej i była dostępna jako `window.nazwaZmiennej` - w przypadku kiedy korzystaliśmy z wielu bibliotek mogły pojawić się problemy z nadpisywaniem się wzajemnie funkcji czy zmiennych o tych samych nazwach.

Innym z problemów było samo udostępnianie i wykorzystywanie kodu - w tym celu po prostu dodawaliśmy plik z interesującym nas fragmentem JS do dokumentu HTML i w momencie załadowania kod był dostępny dla całej strony. Problemy oczywiście pojawiały się w momencie zwiększenia ilości kodu - długie ładowanie, skomplikowane zależności, problemy z utrzymaniem kodu rozproszonego w chaotyczny sposób po wielu plikach.

Problem ten próbowano rozwiązać na wiele sposobów, najpopularniejsze z nich to CommonJS i ES6 modules.

## CommonJS

System modułów składa się z 2 części: pliku eksportującego dane.

Plik, który eksportuje dane w formacie CommonJS używa notacji `module.exports` i określa dwa typy eksportów:

*   eksport domyślny - oznaczony jako `module.exports.default` - każdy moduł może mieć maksymalnie jeden eksport domyślny
*   eksport nazwany - oznaczony jako `modules.exports.NAZWA_EKSPORTU` - każdy moduł może deklarować dowolną ilość nazwanych eskportów

Wszelkie wyeksportowane dane mogą zostać zaimportowane przez dowolny inny moduł/aplikację, zaś dane, które nie są eksportowane są stosowane jako prywatne API modułu i jeżeli nie udostępnimy interfejsu do ich modyfikacji nie będą one mogły być w żaden sposób modyfikowane.

```jsx
// Math.js

const PI = 3.14;
const obwodKola = (r) => 2 * PI * r;

module.exports.pi = PI;
module.exports.detauls = obwodKola; 

// alternatywnie
module.exports = {
  PI,
  default: obwodKola
}
```

W celu uzyskania dostępu do wyeksportowanych danych z innego modułu używamy funkcji `require`. W przypadku modułów CommonJS odwołania do konkretnych eksportów jest dosyć oczywiste - wszystkie one stanowią pola na zaimportowanym obiekcie.

Domyślnie, jeżeli ścieżka do importowanego pliku nie zaczyna się od `.` oznacza to, że moduł powinien zostać odszukany w folderze `node_modules`. Zachowanie to może zostać zmodyfikowane w konfiguracji webpacka.

```jsx
const MyMath = require('./Math.js');
console.log(MyMath.PI); // 3.14;

console.log(MyMath.default(2)); // 2 * PI * r = 12.56

// możemy także zaimportować określone elementy:
const PI = require('./Math.js').PI;
const obwodKola = require('./Math.js').default;

// zaimportuj moduł NPM left-pad z katalogu node_modules
const leftPad = require('left-pad');
```

> #### Uwaga
> Node (a także webpack) w celu optymalizacji wydajności traktuje każdy moduł jako singleton. Oznacza to, że przy kolejnych importach modułu o dokładnie tej samej ścieżce jego kod nie zostanie ponownie wywołany. Dodatkowo wszelkie wewnętrzne modyfikacje poprzez upublicznione API są dostępne również w zaimportowanych kopiach.

## ES6 modules

ES6 definiuje własny format modułów, zachowujący ideę CommonJS ale wprowadzający nową składnię. ES6 modules oferują także dodatkowe zalety w postaci tree shaking (nie importowanie kodu, który nie jest wykorzystywany w aplikacji).

Odpowiednik kodu z poprzednich listingów stosujący zapis `export`:

```jsx
// Math.js

export const PI = 3.14;
export default obwodKola = (r) => 2 * PI * r; // zwróć uwagę na brak const

// alternatywnie
exports = {
  PI
};

const obwodKola = (r) => 2 * PI * r; // zwróć uwagę na brak "const"
export default obwodKola;    
```

Odpowiednio, zamiast `require` używamy konstruktu `import`. Należy zwrócić uwagę, że eksport domyślny możemy zaimportować do naszej aplikacji nadając mu dowolną nazwę - nie musi w żaden sposób pokrywać się z nazwą eksportowanego obiektu znajdującą się w `Math.js`.

> #### Uwaga
> Pomimo że importowanie nazwanych eksportów wygląda podobnie do destrukturyzowania nie jest nim - nie można w ten sposób wydobyć pól składowych eksportu domyślnego.

```jsx
import { PI } from "./Math.js";
console.log(PI); // 3.14;

import obwod from "./Math.js";
console.log(obwod(2)); // 2 * PI * r = 12.56

// możemy także zaimportować wiele rzeczy razem
import obwod, { PI } from "./Math.js";

// lub zaimportować wszystkie nazwane eskporty:
import * as MyMath from "./Math.js";
console.log(MyMath.PI);

// możemy także zmieniać nazwy eksportów nazwanych w momencie importu:
import { PI as prawiePi } from "./Math.js";
console.log(prawiePi); // 3.14
```