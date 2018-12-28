---
title: react-redux
---

W celu rozwiązania problemów, które zidentyfikowaliśmy poprzednio:

- dane do naszego komponentu nie wpływają już jako props, a "pojawiają się" nagle, co zaprzecza jednej z podstawowych reguł React,
- każdy komponent, który potrzebuje komunikować się z Reduxem musi mieć dostęp do obiektu `store`, sposób, w jaki zaimplementowaliśmy to powyżej "spaja" naszą aplikację z Reduxem - nasze komponenty nie mogą być już łatwo używane w innych projektach i środowiskach (np. w testach)

możemy skorzystać z biblioteki [react-redux](https://react-redux.js.org/). Biblioteka ta korzysta z mechanizmu [Context](https://reactjs.org/docs/context.html) Reacta pozwalającego na przekazywanie danych pomiędzy komponentami nie będącymi ze sobą w bezpośredniej relacji.

W przypadku react-redux, przekazywany będzie obiekt `store`, dzięki czemu nasze komponenty nie muszą już importować go w plikach, co rozwiązuje drugi z problemów.

Pierwszy rozwiązywany jest za pomocą wydzielenia "smart components" ("containers") w naszych aplikacjach. Smart components to zwykłe komponenty Reactowe, które "świadome" są istnienia Reduxa i ich zadaniem jest emitowanie akcji oraz pobieranie danych i przekazywanie ich bezpośrednio do komponentów za pomocą props. W ten sposób nasze komponenty, odpowiedzialne za UI, wciąż nadają się do ponownego wykorzystania w innych miejscach lub innych aplikacjach.

Dodatkowo, react-redux posiada kilka mechanizmów, które zapewniają lepszą wydajność aplikacji (np. poprzez unikanie re-renderowania jeżeli dane nie uległy zmianie).